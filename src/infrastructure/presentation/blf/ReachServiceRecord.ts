import { generateKeyPair } from 'crypto';
import { toBytesInt16, toBytesInt32, toUtf8Bytes, toBytesFloat32, toBytesInt8, toBytesInt64, toBytesUint32, toBigEndianUnicodeBytes } from './BlfUtils';
import {faker} from '@faker-js/faker';

const MATCHMAKING_COMMENDATION_COUNT = 16;
const FIREFIGHT_COMMENDATION_COUNT = 13;
const CAMPAIGN_COMMENDATIONS = 16;

const INT32_MAX = 2147483647;
const ONE_MILLION = 1_000_000;

class ReachServiceRecord {
    playerName = faker.internet.userName(); // Should be a 16 character wide string
    playerInfoAvailable = 1; // player info available?
    armorPrimaryColor = faker.number.int({max: 32});
    emblemPrimary = faker.number.int({max: 126});
    emblemBackground = faker.number.int({max: 126});
    emblemSecondary = faker.number.int({min: 0, max: 1});
    emblemPrimaryColor = faker.number.int({max: 32});
    emblemSecondaryColor = faker.number.int({max: 32});
    emblemBackgroundColor = faker.number.int({max: 32});
    serviceTag = faker.string.alphanumeric({length: 4, casing: 'upper'});
    playerAppearance = new Uint8Array([
        0,
        0,
        0,
        0,
        faker.number.int({max: 32}), // armour primary color // 25
        faker.number.int({max: 32}), // secondary color
        faker.number.int({max: 32}), // tertiary color
        faker.number.int({min: 1, max: 2}), // player model choice
        0,
        0,
        0,
        faker.number.int({max: 126}), // emblem primary // 2c
        faker.number.int({max: 126}), // emblem secondary // 2d
        faker.number.int({min: 0, max: 1}), // 2e
        faker.number.int({max: 32}), // emblem colors //2f
        faker.number.int({max: 32}), // 30
        faker.number.int({max: 32}), // 31
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0, // 40
        0x54,
        0,
        0x65,
        0,
        0x73,
        0,
        0x74,
        0,
        0,
        0,
        0,
    ]);
    careerOverviewStatsAvailable = 1;
    credits_available = 1;
    credits = faker.number.int({max: 25_000_000 }) * faker.number.float({min: 0, max: 1})
    campaignRecordAvailable = 1;
    campaignCompletedAt = faker.date.between({
        from: '2010-09-14T00:00:00.000Z',
        to: new Date()
    }).getTime() / 1000;
    campaignCompletionDifficulty = faker.number.int({min: 0, max: 8});
    campaignEnemiesKilled = faker.number.int({max: ONE_MILLION});
    campaignVehiclesDestroyed = faker.number.int({max: 100_000});
    campaignSecondsPlayed = faker.number.int({max: INT32_MAX});
    campaignDifficultyStats = new Array(3).fill(null).map(() => ({
      covenantKills: faker.number.int({max: ONE_MILLION}),
      vehiclesDestroyed: faker.number.int({max: ONE_MILLION}),
      missionsCompletedWithoutDyingOrRestarting: faker.number.int({max: 100_000}),
      highestSkullMultiplier: faker.number.int({max: 13}),
      missionsCompleted: faker.number.int({max: 100_000}),
      dword14: 0,
    }));
    campaignCommendations = new Array(16).fill(null).map((_, i) => ({
      commendation: i + MATCHMAKING_COMMENDATION_COUNT + FIREFIGHT_COMMENDATION_COUNT,
      progress: faker.number.int({max: 10_000}),
    }));
    firefightRecordAvailable = 1;
    firefightCovenantKills = faker.number.int({max: ONE_MILLION});
    firefightVehicleDestroyed = faker.number.int({max: 100_000});
    firefightHighestSetCompleted = faker.number.int({max: 100});
    firefightMostKillsInGame = faker.number.int({max: 10_000});
    firefightWavesCompleted = faker.number.int({max: 10_000});
    firefightGeneratorsDestroyed = faker.number.int({max: 10_000});
    firefightEnemyPlayersKilled = faker.number.int({max: 1_000});
    firefightDifficultyStats = new Array(3).fill(null).map(() => ({
      covenantKills: faker.number.int({max: ONE_MILLION}),
      vehiclesDestroyed: faker.number.int({max: 100_000}),
      highestSetCompleted: faker.number.int({max: 100}),
      mostConsecutiveKillsWithoutDying: faker.number.int({max: 10_000}),
      biggestKill: faker.number.int({max: 100_000}),
      timesBeatPar: faker.number.int({max: 1_000}),
      highestOfficialScore: faker.number.int({max: ONE_MILLION}),
    }));
    firefightCommendations = new Array(13).fill(null).map((_, i) => ({
      commendation: i + MATCHMAKING_COMMENDATION_COUNT,
      progress: faker.number.int({max: 10_000}),
    }));
    matchmakingRecordAvailable = 1;
    matchmakingGamesWon = faker.number.int({max: 100_000});
    matchmakingKills = faker.number.int({max: 100_000});
    matchmakingDeaths = faker.number.int({max: 100_000});
    matchmakingAssists = faker.number.int({max: 100_000});
    matchmakingCategoryStats = new Array(5).fill(null).map(() => ({
      gamesWon: faker.number.int({max: 100_000}),
      kills: faker.number.int({max: 100_000}),
      deaths: faker.number.int({max: 100_000}),
      assists: faker.number.int({max: 100_000}),
      percentOfMatchmakingGamesPlayedInCategory: faker.number.int({max: 100}),
    }));
    arenaSeasonStats = new Array(3).fill(null).map((_, i) => ({
      seasonNumber: i,
      // 8 max
      hopperArenaStats: new Array(2).fill(null).map((_, j) => ({
        hopperName: j ? 'Slayer Pro' : 'Team Slayer',
        gamesPlayedToday: faker.number.int({max: 100}),
        currentBestSet: faker.number.int({max: 100}),
        yesterdaysBestSet: faker.number.int({max: 100}),
        daysRated: faker.number.int({max: 31}),
        divisionStanding: faker.number.int({max: 100}),
        division: faker.number.int({max: 4}),
        dword38: 0,
        dword3C: 0,
        dword40: 0,
        dword44: 0,
        dword48: 0,
        gamesPlayed: faker.number.int({max: 10_000}),
        gamesWon: faker.number.int({max: 10_000}),
        kills: faker.number.int({max: 10_000}),
        assists: faker.number.int({max: 10_000}),
        deaths: faker.number.int({max: 10_000}),
        last7DaysKillsAndAssistsDeathsRatio: faker.number.float(),
        last7DaysKillsDeathsRatio: faker.number.float(),
      })),
    }));
    matchmakingCommendations = new Array(16).fill(null).map((_, i) => ({
      commendation: i,
      progress: faker.number.int({max: 10_000}),
    }));
    customGamesRecordAvailable = 1;
    customGamesMultiplayerPlayed = faker.number.int({max: 100_000});
    customGamesMultiplayerKills = faker.number.int({max: ONE_MILLION});
    customGamesFirefightGamesPlayed = faker.number.int({max: 50_000});
    customGamesFirefightKills = faker.number.int({max: ONE_MILLION});
    legacyRecordAvailable = 1;
    odstFirstPlayedTime = faker.date.between({
        from: '2009-09-22T00:00:00.000Z',
        to: new Date()
    }).getTime() / 1000;
    halo3FirstPlayedTime = faker.date.between({
        from: '2007-09-25T00:00:00.000Z',
        to: new Date()
    }).getTime() / 1000;
    halo2FirstPlayedTime = faker.date.between({
        from: '2004-11-09T00:00:00.000Z',
        to: new Date()
    }).getTime() / 1000;
    halo2HighestDifficulty = faker.number.int({min: 0, max: 8});;
    halo2DwordD1F = 0;
    halo2DwordD23 = 0;
    halo3HighestDifficulty = faker.number.int({min: 0, max: 8});;
    halo3GamesPlayed = faker.number.int({max: 100_000});
    halo3MultiplayerKills = faker.number.int({max: ONE_MILLION});
    odstHighestDifficulty = faker.number.int({min: 0, max: 8});;
    odstGruntsKilledInFirefight = faker.number.int({max: 500_000});;
    
  constructor() {

  }

  toBuffer = () => {
    const header = new Uint8Array(12); // Total size based on struct
    const buffer = new Uint8Array(0xD48 - 12); // Total size based on struct
    
    // Add the header
    header.set(toUtf8Bytes('srid', 4), 0);
    header.set(toBytesInt32(0xD48), 4); // total length, including header
    header.set(toBytesInt16(7), 8); // version 7
    header.set(toBytesInt16(1), 10); // version 1
  
    buffer.set(toBigEndianUnicodeBytes(this.playerName, 16), 0x00);
    buffer.set(toBytesInt8(this.playerInfoAvailable), 0x20);
    // buffer.set(this.playerAppearance, 0x21);
    buffer.set(toBytesInt8(this.armorPrimaryColor), 0x25);
    buffer.set(toBytesInt8(this.emblemPrimary), 0x2C);
    buffer.set(toBytesInt8(this.emblemBackground), 0x2D);
    buffer.set(toBytesInt8(this.emblemSecondary), 0x2E);
    buffer.set(toBytesInt8(this.emblemPrimaryColor), 0x2F);
    buffer.set(toBytesInt8(this.emblemSecondaryColor), 0x30);
    buffer.set(toBytesInt8(this.emblemBackgroundColor), 0x31);
    buffer.set(toBigEndianUnicodeBytes(this.serviceTag, 5), 0x40);
    buffer.set(toBytesInt8(this.careerOverviewStatsAvailable), 0x4C);
    buffer.set(toBytesInt8(this.credits_available), 0x4D);
    buffer.set(toBytesInt32(this.credits), 0x4E);
    buffer.set(toBytesInt8(this.campaignRecordAvailable), 0x52);
    buffer.set(toBytesInt32(this.campaignCompletedAt), 0x53);
    buffer.set(toBytesInt32(this.campaignCompletionDifficulty), 0x57);
    buffer.set(toBytesInt32(this.campaignEnemiesKilled), 0x5B);
    buffer.set(toBytesInt32(this.campaignVehiclesDestroyed), 0x5F);
    buffer.set(toBytesInt32(this.campaignSecondsPlayed), 0x63);
    
    this.campaignDifficultyStats.forEach((stat, index) => {
      const baseOffset = 0x67 + index * 0x18;
      buffer.set(toBytesInt32(stat.covenantKills), baseOffset);
      buffer.set(toBytesInt32(stat.vehiclesDestroyed), baseOffset + 0x04);
      buffer.set(toBytesInt32(stat.missionsCompletedWithoutDyingOrRestarting), baseOffset + 0x08);
      buffer.set(toBytesInt32(stat.highestSkullMultiplier), baseOffset + 0x0C);
      buffer.set(toBytesInt32(stat.missionsCompleted), baseOffset + 0x10);
      buffer.set(toBytesInt32(stat.dword14), baseOffset + 0x14);
    });

    buffer.set(toBytesInt32(this.campaignCommendations.length), 0xAF)
    this.campaignCommendations.forEach((commendation, index) => {
      const baseOffset = 0xB3 + index * 0x08;
      buffer.set(toBytesInt32(commendation.commendation), baseOffset);
      buffer.set(toBytesInt32(commendation.progress), baseOffset + 0x04);
    });

    buffer.set(toBytesInt8(this.firefightRecordAvailable), 0x133);
    buffer.set(toBytesInt32(this.firefightCovenantKills), 0x134);
    buffer.set(toBytesInt32(this.firefightVehicleDestroyed), 0x138);
    buffer.set(toBytesInt32(this.firefightHighestSetCompleted), 0x13C);
    buffer.set(toBytesInt32(this.firefightMostKillsInGame), 0x140);
    buffer.set(toBytesInt32(this.firefightWavesCompleted), 0x144);
    buffer.set(toBytesInt32(this.firefightGeneratorsDestroyed), 0x148);
    buffer.set(toBytesInt32(this.firefightEnemyPlayersKilled), 0x14C);

    this.firefightDifficultyStats.forEach((stat, index) => {
      const baseOffset = 0x150 + index * 0x18;
      buffer.set(toBytesInt32(stat.covenantKills), baseOffset);
      buffer.set(toBytesInt32(stat.vehiclesDestroyed), baseOffset + 0x04);
      buffer.set(toBytesInt32(stat.highestSetCompleted), baseOffset + 0x08);
      buffer.set(toBytesInt32(stat.mostConsecutiveKillsWithoutDying), baseOffset + 0x0C);
      buffer.set(toBytesInt32(stat.biggestKill), baseOffset + 0x10);
      buffer.set(toBytesInt32(stat.timesBeatPar), baseOffset + 0x14);
      buffer.set(toBytesInt32(stat.highestOfficialScore), baseOffset + 0x18);
    });

    buffer.set(toBytesInt32(this.firefightCommendations.length), 0x1A4)
    this.firefightCommendations.forEach((commendation, index) => {
      const baseOffset = 0x1A8 + index * 0x08;
      buffer.set(toBytesInt32(commendation.commendation), baseOffset);
      buffer.set(toBytesInt32(commendation.progress), baseOffset + 0x04);
    });

    buffer.set(toBytesInt8(this.matchmakingRecordAvailable), 0x228);
    buffer.set(toBytesInt32(this.matchmakingGamesWon), 0x229);
    buffer.set(toBytesInt32(this.matchmakingKills), 0x22D);
    buffer.set(toBytesInt32(this.matchmakingDeaths), 0x231);
    buffer.set(toBytesInt32(this.matchmakingAssists), 0x235);

    this.matchmakingCategoryStats.forEach((stat, index) => {
      const baseOffset = 0x239 + index * 0x14;
      buffer.set(toBytesInt32(stat.gamesWon), baseOffset);
      buffer.set(toBytesInt32(stat.kills), baseOffset + 0x04);
      buffer.set(toBytesInt32(stat.deaths), baseOffset + 0x08);
      buffer.set(toBytesInt32(stat.assists), baseOffset + 0x0C);
      buffer.set(toBytesInt32(stat.percentOfMatchmakingGamesPlayedInCategory), baseOffset + 0x10);
    });

    buffer.set(toBytesInt32(this.arenaSeasonStats.length), 0x29D);

    this.arenaSeasonStats.forEach((season, index) => {
      const baseOffset = 0x2A1 + index * 0x348;
      buffer.set(toBytesInt32(season.seasonNumber), baseOffset);
      buffer.set(toBytesInt32(season.hopperArenaStats.length), baseOffset + 0x04);
      season.hopperArenaStats.forEach((hopper, hopperIndex) => {
        const hopperOffset = baseOffset + 0x08 + hopperIndex * 0x68;
        buffer.set(toUtf8Bytes(hopper.hopperName, 32), hopperOffset);
        buffer.set(toBytesInt32(hopper.gamesPlayedToday), hopperOffset + 0x20);
        buffer.set(toBytesInt32(hopper.currentBestSet), hopperOffset + 0x24);
        buffer.set(toBytesInt32(hopper.yesterdaysBestSet), hopperOffset + 0x28);
        buffer.set(toBytesInt32(hopper.daysRated), hopperOffset + 0x2C);
        buffer.set(toBytesInt32(hopper.divisionStanding), hopperOffset + 0x30);
        buffer.set(toBytesInt32(hopper.division), hopperOffset + 0x34);
        buffer.set(toBytesInt32(hopper.dword38), hopperOffset + 0x38);
        buffer.set(toBytesInt32(hopper.dword3C), hopperOffset + 0x3C);
        buffer.set(toBytesInt32(hopper.dword40), hopperOffset + 0x40);
        buffer.set(toBytesInt32(hopper.dword44), hopperOffset + 0x44);
        buffer.set(toBytesInt32(hopper.dword48), hopperOffset + 0x48);
        buffer.set(toBytesInt32(hopper.gamesPlayed), hopperOffset + 0x4C);
        buffer.set(toBytesInt32(hopper.gamesWon), hopperOffset + 0x50);
        buffer.set(toBytesInt32(hopper.kills), hopperOffset + 0x54);
        buffer.set(toBytesInt32(hopper.assists), hopperOffset + 0x58);
        buffer.set(toBytesInt32(hopper.assists), hopperOffset + 0x5C);
        buffer.set(toBytesFloat32(hopper.last7DaysKillsAndAssistsDeathsRatio), hopperOffset + 0x60);
        buffer.set(toBytesFloat32(hopper.last7DaysKillsDeathsRatio), hopperOffset + 0x64);
      });
    });

    buffer.set(toBytesInt32(this.matchmakingCommendations.length), 0xC79);
    this.matchmakingCommendations.forEach((commendation, index) => {
      const baseOffset = 0xC7D + index * 0x08;
      buffer.set(toBytesInt32(commendation.commendation), baseOffset);
      buffer.set(toBytesInt32(commendation.progress), baseOffset + 0x04);
    });

    buffer.set(toBytesInt8(this.customGamesRecordAvailable), 0xCFD);
    buffer.set(toBytesInt32(this.customGamesMultiplayerPlayed), 0xCFE);
    buffer.set(toBytesInt32(this.customGamesMultiplayerKills), 0xD02);
    buffer.set(toBytesInt32(this.customGamesFirefightGamesPlayed), 0xD06);
    buffer.set(toBytesInt32(this.customGamesFirefightKills), 0xD0A);
    buffer.set(toBytesInt8(this.legacyRecordAvailable), 0xD0E);
    buffer.set(toBytesInt32(this.odstFirstPlayedTime), 0xD0F);
    buffer.set(toBytesInt32(this.halo3FirstPlayedTime), 0xD13);
    buffer.set(toBytesInt32(this.halo2FirstPlayedTime), 0xD17);
    buffer.set(toBytesInt32(this.halo2HighestDifficulty), 0xD1B);
    buffer.set(toBytesInt32(this.halo2DwordD1F), 0xD1F);
    buffer.set(toBytesInt32(this.halo2DwordD23), 0xD23);
    buffer.set(toBytesInt32(this.halo3HighestDifficulty), 0xD27);
    buffer.set(toBytesInt32(this.halo3GamesPlayed), 0xD2B);
    buffer.set(toBytesInt32(this.halo3MultiplayerKills), 0xD2F);
    buffer.set(toBytesInt32(this.odstHighestDifficulty), 0xD33);
    buffer.set(toBytesInt32(this.odstGruntsKilledInFirefight), 0xD37);
  
    return Buffer.concat([header,buffer]);
  }
}

export default ReachServiceRecord;