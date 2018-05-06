import {Input, Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'detail-dialog',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})

export class DetailComponent {

  @Input() tourData;  // 親コンポーネンから受け取る属性pp
  @ViewChild('lgModal') modalRef: ModalDirective;  // Modalダイアログへの参照

  constructor() { }

  // ダイアログを開く
  openDialog() {
    this.modalRef.show();
  }

}

