import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss']
})
export class DropdownButtonComponent implements OnInit {
  @Input() data: any;
  @Input() selected: any;
  @Input() showKey: string;
  @Input() suffix = '';
  @Input() placeholder = '';
  @Output() onUpdate: EventEmitter<any> = new EventEmitter()

  ngOnInit() { }

  select(element: any): void {
    this.selected = element;
    this.onUpdate.emit(this.selected);
  }
}
