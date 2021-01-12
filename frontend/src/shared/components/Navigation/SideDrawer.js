import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.css';

const SideDrawer = (props) => {
  // timeout for delay on transition, classNames is library specific and defines the animation
  // mount aside component (children) on enter transition and exit on unmount transition
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  // portal renders an element outside of its parent component's DOM node (#root)
  // while also maintainig the properties and behaviour it inherited from the React tree (MainNavigation)
  // doing this makes the sidedrawer make more sense semantically
  return ReactDOM.createPortal(content, document.querySelector('#drawer-hook'));
};

export default SideDrawer;
