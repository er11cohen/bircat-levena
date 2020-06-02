import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public settings: Settings;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.settings = this.settingsService.getSettings();
  }

}
