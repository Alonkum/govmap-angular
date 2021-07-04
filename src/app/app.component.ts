import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { DynamicLayer } from './api.model';
import { GovmapService } from './services/govmap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  $layers!: Observable<any>;

  @ViewChildren('checkbox')
  checkboxes!: Array<MatCheckboxChange>;

  constructor(private govmap: GovmapService) {

  }

  ngOnInit() {
    this.$layers = this.govmap.getLayers();
  }

  toggleLayers(e: MatCheckboxChange, layer: any) {
    if (e.checked) {
      this.govmap.$layersChange.next({ action: "add" , layer })
    } else {
      this.govmap.$layersChange.next({ action: "remove", layer })
    }

  }


}
