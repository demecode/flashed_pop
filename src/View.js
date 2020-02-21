import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { model } from './Model';
import { newCardMsg } from './Update';

const { div, h1, pre, a, i, textarea, form, thead, tr, th, label, input, button } = hh(h);




const view = () => {
    return div({ className: 'mw8 center' }, [
        h1({ className: 'f2 pv2 bb' }, ['Woah woah']),
        div(
            button(
              {
                onclick: () => dispatch(newCardMsg),
              },
              [i({ className: 'fa fa-plus ph1' }), 'Add Card'],
            ),
          ),
    ])
}

export default view;