from flask import send_file

def register_routes(app, mongo):    
    @app.route('/storage/user/<string:arg1>/<string:arg2>/<string:arg3>/<string:username>/user.bin')
    def service_record(arg1, arg2, arg3, username):
        print(username)
        return send_file("public/storage/user/0/0/00/000000000000EAD3/user.bin")

    @app.route('/storage/user/<string:arg1>/<string:arg2>/<string:arg3>/<string:username>/recent_players.bin')
    def recent_players(arg1, arg2, arg3, username):
        print(username)
        return send_file("public/storage/user/0/0/00/000000000000EAD3/recent_players.bin")