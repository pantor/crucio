import { app } from './../../crucio';

class DropdownController {
  data: any;
  selected: any;
  placeholder: string;
  suffix: string;
  onUpdate: any;
  showKey: string;

  constructor(private readonly $timeout) {

  }

  select(element: any): void {
    this.selected = element;

    this.$timeout(() => {
      this.onUpdate();
    })
  }
}

export const DropdownComponent = 'dropdown';
app.component(DropdownComponent, {
  templateUrl: 'app/components/dropdown/dropdown.html',
  controller: DropdownController,
  bindings: {
    data: '<',
    selected: '=',
    showKey: '@',
    placeholder: '@',
    suffix: '@',
    onUpdate: '&',
  }
});
