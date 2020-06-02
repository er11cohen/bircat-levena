import {EndBircatLevana, Nusach, StartBircatLevana} from '../shared/enums';

export interface Settings {
    nusach: Nusach;
    startBircatLevana: StartBircatLevana;
    endBircatLevana: EndBircatLevana;
}
