import ISoundService from "../interfaces/ISoundService";

export class AbstractSoundService implements ISoundService {
    loadSound(name: string) {
        console.log('this is abstract implementation of ISoundService, please make sure to override');
    };
}

