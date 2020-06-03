import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {UtilsService} from '../services/utils.service';

@Injectable({
    providedIn: 'root',
})
export class DataReadyGuard implements CanActivate, CanActivateChild {
    constructor(
        private readonly utilsService: UtilsService,
    ) {
    }

    public async canActivate(): Promise<boolean> {
        return this.hasAccess();
    }

    public async canActivateChild(): Promise<boolean> {
        return this.hasAccess();
    }

    private async hasAccess(): Promise<boolean> {
        await this.utilsService.initialData();
        return true;
    }
}
