import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {Nusach} from '../../shared/enums';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public settings: Settings;
  public nusach: typeof Nusach = Nusach;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
  }

}
