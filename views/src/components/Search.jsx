import React from 'react';
import axios from 'axios';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
    buttonWrap: { 
        marginTop: '2%'
    },

    textBoxWrap: {
        marginTop: '2%',
    },

    textBox: {
        width: '50%',
    },

    centering: {
        textAlign: 'center',
    }
}

//検索画面を表示するコンポーネント
class Search extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            open: false,　//Snackbarの開閉状態
            message:'',　//Snackbarに表示するメッセージ
        };
        
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    //Github APIからユーザー情報の取得
    handleButtonClick(){
        // document.querySelectorを使うのはあんまりReactらしくないかも
        // この場合、TextFieldの値をstateで管理して、TextFieldのvalueに value={this.state.value} って感じで書き込む
        // onChangeにstateを書き換えるのを使って
        /**
         * onChangeHandler = (event) => {
         *  this.setState({ value: event.target.value })
         * }
         */
        // この書き方がReactらしい書き方！
        // このonChnageHandlerをTextFieldのonChangeに渡せばいい感じになると思う。 onChange={this.onChangeHandler}
        let userName = document.querySelector('#name_box').value;
        let url = 'https://api.github.com/users/'+userName+'/repos';
        const regex = new RegExp('^[亜-熙ぁ-んァ-ヶ]+$');

        if(userName === ''){
            this.setState({
                open: true,
                message: 'ユーザー名が未入力です'
            });
            return false;
        }

        if(regex.test(userName)){
            this.setState({
                open: true,
                message: 'ユーザー名に日本語は使用できません'
            });
            return false;
        }

        // APIの処理は本来であればコンポーネントに書くべきではなく、 /api/client.js とかを作ってそこにまとめて置くべき
        // でないと例えば全てのAPIが /v1/something/ から始まるAPIだったとして、 /v1/anything に書き換えてくださいって言われた時にコンポーネント全ファイルを確認しないといけなくなる
        // だからAPIの処理は1つのファイルに書いておいてコンポーネントから呼び出すのが正解。
        // ただ今回の場合、Reduxを使っているからコンポーネントから呼び出すのも不正解で、今回の場合は、リクエストをするActionをつくってそのActionをコンポーネントから呼び出すのが正解
        // RequestAction -> API -> （成功したら） SuccessAction
        //                      -> （失敗したら） FailureAction
        // って感じにする。

        //API get
        axios.get(url).then(

            (res) => {
                if(res['data'].length === 0){
                    this.setState({
                        open: true,
                        message: ' ユーザーが見つかりませんでした'
                    });
                    return false;
                }

                //StoreにuserNameと、リポジトリ情報をセット
                this.props.setUserName(userName);
                this.props.setUserRepo(res['data']);

                //リポジトリ一覧へ遷移
                this.props.history.push('/repos');
            },

            (res) => {
                if(res.response.status === 404){
                    this.setState({
                        open: true,
                        message: 'ユーザーが見つかりませんでした.'
                    });
                    return false;
                }
            }
        ).catch(
            (err)=>{
                console.log(err.response.status);
                if(err.response.status === 404){
                    this.setState({
                        open: true,
                        message: '通信に失敗しました.'
                    });
                    return false;
                }
            }
        );
    }

    // あとES6にはasync/awaitという機能があるのでそれを使うと少し綺麗にかける
    // 本来であれば
    /**
     * try {
     *  const res = await axios.get(url)
     *  successAction(res)
     * } catch(err) {
     *  failureAction(err)
     * }
     */
    // って感じで書いてsuccessActionとかに処理自体を書くのがいい。
    // 下はasync/awaitで書いた時のコード

    // async handleButtonClickRewiteByJunya(){
    //     let userName = document.querySelector('#name_box').value;
    //     let url = 'https://api.github.com/users/'+userName+'/repos';
    //     const regex = new RegExp('^[亜-熙ぁ-んァ-ヶ]+$');

    //     if(userName === ''){
    //         this.setState({
    //             open: true,
    //             message: 'ユーザー名が未入力です'
    //         });
    //         return false;
    //     }

    //     if(regex.test(userName)){
    //         this.setState({
    //             open: true,
    //             message: 'ユーザー名に日本語は使用できません'
    //         });
    //         return false;
    //     }

    //     //API get
    //     try {
    //         const res = await axios.get(url)
    //         if(res['data'].length === 0){
    //             this.setState({
    //                 open: true,
    //                 message: ' ユーザーが見つかりませんでした'
    //             });
    //             return false;
    //         }

    //         //StoreにuserNameと、リポジトリ情報をセット
    //         this.props.setUserName(userName);
    //         this.props.setUserRepo(res['data']);

    //         //リポジトリ一覧へ遷移
    //         this.props.history.push('/repos');

    //     } catch(err) {
    //         if(err.response.status === 404) {
    //             this.setState({
    //                 open: true,
    //                 message: 'ユーザーが見つかりませんでした.'
    //             })
    //         }
    //         return false
    //     }
    // }

    //Snackbarを閉じるための関数
    handleRequestClose(){
        this.setState({
          open: false,
        });
    }

    render(){
        return(
            <MuiThemeProvider>
                <div>
                    <h1 style={styles.centering}>Repository Browser</h1>
                    <p style={styles.centering}>Githubのユーザー名を入力し、そのユーザーのリポジトリを閲覧できます</p>
                    <div style={styles.centering}>
                        <TextField
                            id="name_box"
                            label="Github User Name"
                            name="user_name"
                            style={styles.textBox}
                        />
                    </div>         
                    {/*
                        これは以下と同じではないか...？
                        <div style={styles.buttonWrap,styles.centering}>
                    */}
                    <div style={Object.assign({},...[styles.buttonWrap,styles.centering])}>  
                        {/* いろんな箇所でbindをするのではなくせめて一箇所に揃えよう */}
                        <Button variant="outlined" onClick={this.handleButtonClick.bind(this)}>
                            検索する
                        </Button>
                    </div>
                    <Snackbar
                        open={this.state.open}
                        onClose={this.handleRequestClose}
                        autoHideDuration={3000}
                        style={styles.centering}
                        message={<span id="message-id">{this.state.message}</span>}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}

export default(Search);