import { Component, Inject, OnInit } from '@angular/core';
import { HebrewDateFormatter, JewishDate } from 'kosher-zmanim';
import * as moment from 'moment';
import { CoordinatesService } from 'src/app/services/coordinates.service';
import { TranslationsDictionary, TRANSLATIONS_DICTIONARY } from 'src/app/services/translations-dictionary';

@Component({
  selector: 'app-sky-status',
  templateUrl: './sky-status.page.html',
  styleUrls: ['./sky-status.page.scss'],
})
export class SkyStatusPage implements OnInit {

  public data = [];
  constructor(
    private readonly coordinatesService: CoordinatesService,

    @Inject(TRANSLATIONS_DICTIONARY)
    public readonly dict: TranslationsDictionary,
  ) { }

  ngOnInit() {
    const formatter = new HebrewDateFormatter();
    formatter.setHebrewFormat(true);

    const coordinates = this.coordinatesService.getCoordinates();
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lon=${coordinates.longitude}&appid=c002fb431a9242cdd367b22f34ea9cd6&lat=${coordinates.latitude}`)
      .then(res => res.json())
      .then(json => {
        debugger
        this.data = json.list.reduce((acc, item) => {
          const dateObj = new Date(item.dt_txt);
          const date = dateObj.getDate()
          const month = dateObj.getMonth()
          const hours = dateObj.getHours()

          const data = {
            hours,
            clouds: item.clouds.all,
          }

          const hebDate = hours < 6 ? new Date(dateObj.setDate(date - 1)) : dateObj;
          
          const label = (hours < 6 ? `${date-1}-${date} / ${month + 1}` :  `${date}-${date+1} / ${month +1}`) + ' ~ '
                        + formatter.format(new JewishDate(hebDate))

          if (hours >= 18 || hours <= 3) {
            if (acc[label]) {
              acc[label].push(data)
            } else {
              acc[label] = [data]
            }
          }
          return acc
        }, []);
      });
  }

}
