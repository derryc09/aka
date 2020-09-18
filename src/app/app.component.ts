import { Component } from '@angular/core';
import { SearchComponent } from './pages/search/search.component';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'aka';


  itemRef: AngularFireObject<any>;
  item: Observable<any>;
  constructor(db: AngularFireDatabase) {
    this.itemRef = db.object('company');
    this.item = this.itemRef.valueChanges();
  }
  save(newName: string) {
    this.itemRef.set({ name: newName });
  }
  update(newSize: string) {
    this.itemRef.update({ size: newSize });
  }
  delete() {
    this.itemRef.remove();
  }
  
}
