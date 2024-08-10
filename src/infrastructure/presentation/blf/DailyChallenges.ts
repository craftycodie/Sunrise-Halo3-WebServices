import {
  toBytesInt16,
  toBytesInt32,
  toBytesInt8,
} from './BlfUtils';

export default class DailyChallenges {
  challenges = [
    // {
    //   category: 0,
    //   index: 0,
    //   rewardCredits: 3000,
    // }, 
    // {
    //   category: 1,
    //   index: 1,
    //   rewardCredits: 5000,
    // }
  ];

  toBuffer = () => {
    const dchaBytes = new Uint8Array(0x26 + (this.challenges.length * 28));
    dchaBytes.set(Buffer.from('dcha', 'utf8'), 0);
    dchaBytes.set(toBytesInt32(dchaBytes.length), 4);
    dchaBytes.set(toBytesInt16(3), 8);
    dchaBytes.set(toBytesInt16(1), 10);
    dchaBytes.set(toBytesInt8(this.challenges.length), 0x24);

    for (let challengeIndex = 0; challengeIndex < this.challenges.length; challengeIndex++) {
      const challenge = this.challenges[challengeIndex];
      
      const challengeOffset = 0x26 + (28 * challengeIndex);

      dchaBytes.set(toBytesInt8(challenge.category), challengeOffset);
      dchaBytes.set(toBytesInt8(challenge.index), challengeOffset + 1);
      dchaBytes.set(toBytesInt16(challenge.rewardCredits), challengeOffset + 2);

    }

    return Buffer.from(dchaBytes);
  };
}
