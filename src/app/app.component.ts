import { Component, OnInit } from '@angular/core';
import { SearchComponent } from './pages/search/search.component';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'AKA';


  // itemsRef: AngularFireObject<any>;
  valueChanges: Observable<any>;
  items: Observable<any>;
  snapshotChanges: Observable<any>;

  // dinosaurs$: Observable<any>;
  constructor(db: AngularFireDatabase) {
    this.valueChanges = db.list('companies').valueChanges();
    this.snapshotChanges = db.list('companies').snapshotChanges();
    console.log(this.valueChanges);

  }

}
