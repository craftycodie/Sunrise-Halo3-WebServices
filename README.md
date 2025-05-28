![hero](hero.jpg)
# Halo 3 Web Services [![Build status](https://ci.appveyor.com/api/projects/status/eip5dxg0ig0bbpu9?svg=true)](https://ci.appveyor.com/project/craftycodie/sunrise-webserver)

> [!IMPORTANT]
> This project has been discontinued as of Janauury 2025, it has been rewritten using a combination of NestJS and Rust, and the new API is closed-source. This repository remains public as a rough example of a clean-code NestJS API and as a MVP implementation of a web server for Xbox 360 generation Halo games. Outside contributions will not be accepted at this time, and new issues will likely be ignored.


This api contains a rough reimplementation of all of Halo 3's web services including support for 
- Matchmaking
- File Share
- Bungie Favourites
- Bungie Pro
- Banhammer
- Active Transfer
- Service Records
- MOTDs
- Screenshots
- Nameplates
- Crash Reporting
- Webstats (needs a lot of work, see [#4](https://github.com/craftycodie/Sunrise-Halo3-WebServices/issues/4))

and much more :)

These web services were created for the retail version of Halo 3 for the Xbox 360. However, most builds of Halo 3 should be supported. PC builds, if they were to somehow connect, do use the same endpoints, leaked pre-release builds for the 360 however do not, though the changes are probably minor. The beta should also be supported.

This project is built for use with [Sunrise-Plugin](https://github.com/craftycodie/Sunrise-Plugin), a dashlaunch plugin which connects Xbox 360 Halo 3 to a custom webserver.

## Preparing the project

1. Install dependencies with the `npm install` command.
2. Create a `.env` file in the project root, following this structure:

```env
  API_PORT=8080
  MONGO_URI=
```

3. Build the web service with the `npm run build` command.

## Handling Title Storage (Playlists/MOTDs/More)

This API is setup to serve "title storage" files, however these files are not included. Back in the day, Bungie had a bunch of tooling including big ass spreadsheets and debug game builds to spit out these files, these days we have a tool to generate everything we need from JSON called [Sunrise-BLFTool](https://github.com/craftycodie/Sunrise-BLFTool).

There are a few options for content.
1. Grab my recommended title storage files from the [Sunrise-Content](https://github.com/craftycodie/Sunrise-Content) repository.
2. Fork the [Sunrise-Content](https://github.com/craftycodie/Sunrise-Content) repository and roll your own.
3. Grab [Gamecheat13's backup](https://github.com/Gamecheat13/RawGames/tree/Halo/Halo%203/11855.07.08.20.2317.halo3_ship/title%20storage/title/default_hoppers) of the OG title storage before the servers were shutdown.
  - Please note, this backup is slighlty corrupt (bad hash on network_configuration) which does cause some notable bugs, I recommend against this generally.

Once you've got the files you need, they live in `public/storage/title`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
---

Last Updated 28/05/25 by Codie Newark 🐧
