import {EndBircatLevana, Languages, Nusach, StartBircatLevana} from '../shared/enums';

export interface Settings {
    nusach: Nusach;
    startBircatLevana: StartBircatLevana;
    endBircatLevana: EndBircatLevana;
    language: Languages;
    darkMode: boolean;
    fontSize: string;
}
