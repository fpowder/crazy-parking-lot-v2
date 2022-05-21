import * as _ from 'lodash';
import './style.css';
import Icon from './icon.png';
import printMe from './print/print';

function component() {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    // 이제 Lodash를 스크립트로 가져왔습니다.
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    // add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    return element;
  }
  
  document.body.appendChild(component());