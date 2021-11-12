import { atom }  from 'recoil';

export const navState = atom({
    key: 'navState',
    default: 'Home'
});

export const selected = atom({
    key: 'selectedRow',
    default: null
});

export const selectedObject = atom({
  key: 'selectedObj',
  default: null,  
})