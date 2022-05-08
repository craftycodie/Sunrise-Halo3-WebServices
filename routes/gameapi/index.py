from flask import send_file, request, Response
import time
import os

def register_routes(app, mongo):    
    @app.route('/gameapi/FilesGetCatalog.ashx')
    def fileshare():
        title = request.args.get('title')
        userId = request.args.get('userId')
        shareId = request.args.get('shareId')
        locale = request.args.get('locale')

        if (shareId == "ffffffffffffff01"):
            return send_file(os.path.join(os.getcwd(), "public/gameapi/BungieFavourites.ashx"))
        if (title == "3"):
            return send_file(os.path.join(os.getcwd(), "public/gameapi/FilesGetCatalogODST.ashx"))
        else:
            return send_file(os.path.join(os.getcwd(), "public/gameapi/FilesGetCatalog.ashx"))

    @app.route('/gameapi/FilesNewUpload.ashx')
    def fileshare_check():
        return Response("", 200)


    @app.route('/gameapi/FilesUpload.ashx', methods=['POST'])
    def fileshare_upload():
        content = request.get_data()
        f = open(os.path.join(os.getcwd(), "fileshare/" + str(time.time()) + ".blf"), "wb")
        f.write(content)
        f.close()
        return Response("", 200)



    @app.route('/gameapi/MachineUpdateNetworkStats.ashx', methods=['POST'])
    def machinestats():
        return Response("", 200)