const initialState = {
    userName:'',
    userRepo: {},
    selectRepo: {}
}

export default function searchReducer(state = initialState,action){
    switch(action.type){
        case 'SET_USER':
            // stateを直接変更しないよう、Object.assignでstateを複製
            return Object.assign({},state,{
                userName: action.userName
            });
            /**
             * 最近のES6の書き方だとObject.assignを使うより
            // return {
            //     ...state,
            //     userName: action.userName
            // }
            みたいなコード書くとかっこいい！
            {...state} はスプレッド演算子ってやつ！
            https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax
            スプレッド演算子も破壊的変更を行わないのでstateを直接書き換える心配がない
            */

        case 'SET_REPOSITORY':
            return Object.assign({},state,{
                userRepo: action.repository
            });

        case 'SET_SELECT_REPOSITORY':
            return Object.assign({},state,{
                selectRepo: action.repository
            });

        default:
            return state;
    }
}
