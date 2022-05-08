from flask import send_file

def register_routes(app, mongo):    
    @app.route('/storage/machine/<string:arg1>/<string:arg2>/<string:arg3>/<string:username>/machine.bin')
    def machine(arg1, arg2, arg3, username):
        print(username)
        return send_file("public/storage/machine/0/0/00/0000000000000001/machine.bin")