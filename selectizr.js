class Selectizr {
  constructor(el) {
    this.el = el;
    this.selectizeHolder = document.createElement('div');
    this.dropDownHandle = document.createElement('img');
    this.chips = document.createElement('div');
    this.dropDown = document.createElement('div');
    this.dropDownList = document.createElement('ul');
    this.dropDownOption = undefined;
    this.input = undefined;

    this.selectizeHolder.classList.add('select-holder');
    this.dropDownHandle.classList.add('drop-down-handle');
    this.dropDownList.classList.add('drop-down-list');
    this.chips.classList.add('chips');
    this.dropDown.classList.add('drop-down-options');
    this.dropDownHandle.src = 'https://png.icons8.com/metro/100/000000/chevron-down.png';

    this.selectized = [];
    this.selectized.push({id: this.el.getAttribute('id')});
    this.selectedChips = [];
  }
}

Selectizr.prototype.create = function (labels, options, chipStyle) {
  let _this = this;
  let _thisChipStyle = chipStyle;

  this.el.appendChild(this.selectizeHolder);
  this.selectizeHolder.appendChild(this.chips);
  this.el.appendChild(this.dropDown);
  this.dropDown.appendChild(this.dropDownList);

  this.input = document.createElement('input');
  this.input.setAttribute('placeholder', labels);
  this.input.classList.add('selectize-input');
  this.input.classList.add('show');
  this.selectizeHolder.appendChild(this.input);

  this.selectizeHolder.appendChild(this.dropDownHandle);

  for (var i = 0; i < options.length; i++) {
    this.dropDownOption = document.createElement('li');
    this.dropDownOption.classList.add('drop-down-option');
    this.dropDownOption.setAttribute('data-id', options[i].id);
    this.dropDownOption.innerHTML = options[i].value;
    this.dropDownList.appendChild(this.dropDownOption);
    this.dropDownOption.addEventListener('click', (e) => {
      _this.createChip(e.target.dataset.id, e.target.innerHTML, _thisChipStyle);
      e.target.classList.add('selected');
      _this.dropDownHandle.classList.remove('rotate');
    });
  }

  this.listeners();
};

Selectizr.prototype.listeners = function () {
  let _this = this;
  this.dropDownHandle.addEventListener('click', () => {
    if (!_this.dropDown.classList.contains('show') && !_this.dropDownHandle.classList.contains('rotate')) {
      _this.dropDownHandle.classList.add('rotate');
      _this.dropDown.classList.add('show');
    } else {
      _this.dropDownHandle.classList.remove('rotate');
      _this.dropDown.classList.remove('show');
    }
  });

  this.input.addEventListener('focus', () => {
    _this.dropDownHandle.classList.add('rotate');
    _this.dropDown.classList.add('show');
  });

  this.chips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chips')) {
      _this.dropDown.classList.add('show');
      _this.dropDownHandle.classList.add('rotate');
    }
  });

  document.addEventListener('click', (e) => {

    if (!e.target.classList.contains('selec-holder') && !e.target.classList.contains('selectize-input')
    && !e.target.classList.contains('chips') && !e.target.classList.contains('chip') && !e.target.classList.contains('drop-down-handle')
    && !e.target.classList.contains('drop-down-options') && !e.target.classList.contains('drop-down-list')
    && !e.target.classList.contains('drop-down-option')) {
      _this.dropDown.classList.remove('show');
      _this.dropDownHandle.classList.remove('rotate');
    }
  });
};

Selectizr.prototype.createChip = function (id, value, chipStyle = {'background': '#9e9e9e', 'color': '#fff'}) {
  let _this = this;
  let chip = document.createElement('span');
  let chipName = document.createElement('span');
  let chipClose = document.createElement('span');
  let chipCloseImg = document.createElement('img');

  this.input.classList.remove('show');
  this.chips.classList.add('show');
  // dropDown.classList.remove('show');

  chipName.innerHTML = value;
  chipCloseImg.src = "https://png.icons8.com/ios/100/ffffff/delete-sign.png";

  chipName.classList.add('chip-name');
  chipClose.classList.add('remove-chip');
  chip.classList.add('chip');
  chip.setAttribute('data-chip-id', id);

  chip.style.background = (chipStyle.background === undefined && chipStyle !== undefined) ? '#9e9e9e' : chipStyle.background;
  chip.style.color = (chipStyle.color === undefined && chipStyle !== undefined) ? '#fff' : chipStyle.color;

  this.chips.appendChild(chip);
  chip.appendChild(chipName);
  chip.appendChild(chipClose);
  chipClose.appendChild(chipCloseImg);

  this.selectedChips.push({'id': chip.dataset.chipId, 'value': chipName.innerHTML});

  chipClose.addEventListener('click', (e) => {
    _this.chips.removeChild(chip);
    _this.dropDown.classList.remove('show');

    let selectedListForChip = _this.el.querySelectorAll(`[data-id]`);
    selectedListForChip.forEach(list => {
      if (list.dataset.id == e.target.parentNode.parentNode.dataset.chipId) {
        list.classList.remove('selected');
        this.selectedChips.pop(list.dataset.id);
      }
    });

    let checkForChips = document.querySelectorAll('[data-selectize] .chip');
    if (checkForChips.length == 0) {
      _this.input.classList.add('show');
      _this.chips.classList.remove('show');
    }
  });
};

Selectizr.prototype.getSelectedChips = function () {
  return this.selectedChips;
};
