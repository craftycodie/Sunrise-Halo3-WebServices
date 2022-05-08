from flask import request, Response
import time
import os

def register_routes(app, mongo):    
    @app.route('/upload_server/stats.ashx', methods=['POST'])
    def webstats():
        content = request.get_data()
        f = open(os.path.join(os.getcwd(), "webstats" + str(time.time()) + ".blf"), "wb")
        f.write(content)
        f.close()
        return Response("DONE", 200)

    @app.route('/upload_server/upload.ashx', methods=['POST'])
    def crash_dump():
        file = request.files['upload']
        file.save(os.path.join(os.getcwd(), "crashes/" + file.filename))
        return Response("DONE", 200)