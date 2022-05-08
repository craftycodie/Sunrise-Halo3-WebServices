import codecs
from flask import request, abort, render_template, send_from_directory, Markup
import os
from markdown import markdown

readme_html = None
static_folder = None
mongo = None

def serve(path):
    global static_folder
    global mongo
    global readme_html

    if path == "":
        return abort(404)

    # if not request.is_secure:
    #     return redirect(request.url.replace('http://', 'https://'))

    elif os.path.exists("templates/public/" + path + ".html"):
        return render_template("public/" + path + ".html", readme_html=readme_html, args=request.args)
    elif os.path.exists(static_folder + '/' + path):
        return send_from_directory(static_folder, path)

    return abort(404)

def register_routes(app, _mongo):
    global readme_html
    global static_folder
    global mongo

    from routes.user import register_routes as register_user_routes
    from routes.machine import register_routes as register_machine_routes
    from routes.gameapi import register_routes as register_gameapi_routes
    from routes.upload_server import register_routes as register_uploadserver_routes

    register_user_routes(app, mongo)
    register_machine_routes(app, mongo)
    register_gameapi_routes(app, mongo)
    register_uploadserver_routes(app, mongo)

    readme_file = codecs.open("README.md", mode="r", encoding="utf-8")
    readme_html = Markup(markdown(readme_file.read()))
    readme_file.close()
    static_folder = app.static_folder
    mongo = _mongo

    @app.route('/', defaults={'path': 'index'})
    @app.route('/<path:path>')
    def serveroute(path):
        return serve(path)