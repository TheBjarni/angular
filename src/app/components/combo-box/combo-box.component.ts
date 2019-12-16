import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.sass']
})
export class ComboBoxComponent implements OnInit {

  @ViewChild('combo', {static: true}) combo: ElementRef<HTMLInputElement>;
  @Input() id: string;
  @Input() label: string;
  @Input() comboItems: ComboItem[];
  @Output() comboChanged = new EventEmitter();

  ngOnInit() {
  }

  reset() {
    if (this.comboItems && this.comboItems.length > 0) {
      this.combo.nativeElement.value = this.comboItems[0].value;
    }
  }

}
