import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Link, Route, Redirect } from "react-router-dom";

const { render } = ReactDOM;

const app = document.querySelector('#app');

class PageBody extends Component {

    state = {
        posts: [],
    }

    componentDidMount() {
        // const { searchVal } = this.props;
        fetch(`https://www.reddit.com/r/${ this.props.searchVal }/hot/.json`)
        .then(res => res.json())
        .then(data => {
            const postList = data.data.children;
            // console.log(postList)
            this.setState({
                posts: postList.filter(post => {
                    if (post.data.secure_media !== null) {
                        return post;
                    }
                })
            })
            // console.log(this.state);
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        const { searchVal } = this.props;
        const { posts } = this.state;
        // console.log(posts);
        // console.log('i have rendered');
        return (
            <div className='container'>
                <div style={{display:'flex'}}>
                    <Link to='/'><button className='digButton'>Go Back</button></Link>
                    <h1 className='resultsHeader'>You are digging r/{ searchVal }</h1>
                </div>
                    {
                        posts.map((post, idx) => {
                            const leftTagRegEx = /&lt;/gi;
                            const rightTagRegEx = /&gt;/gi;
                            let mediaEmbed = post.data.secure_media_embed.content.replace(leftTagRegEx, '<');
                            mediaEmbed = mediaEmbed.replace(rightTagRegEx, '>')
                            const videoId = post.data.url.slice(-11);
                            const downloadButtonIFrame = `<iframe style="width:100%;min-width:200px;max-width:350px;height:57px;border:0;overflow:hidden;" scrolling="no" src="//break.tv/widget/button/?link=https://www.youtube.com/watch?v=${ videoId }&color=DA4453&text=fff"></iframe>`
                            function createEmbed() {
                                return {__html: `${ mediaEmbed }`}
                            }
                            function createDownloadButton() {
                                return {__html: downloadButtonIFrame }
                            }
                            return (
                                <div key={ idx }className='videoCard'>
                                    <div className='videoWrapper'>
                                        <div dangerouslySetInnerHTML={ createEmbed() } />
                                        <div dangerouslySetInnerHTML={ createDownloadButton() } />
                                        {/* <button onClick={ () => downloadMp3(videoId) }className='downloadButton'>Download MP3</button> */}
                                    </div>
                                    <div>
                                        <h2 style={{textAlign:'center'}}>{ post.data.secure_media.oembed.title }</h2>
                                    </div>
                                </div>   
                            )
                        })
                    }
            </div>
        )
    }
}

class Home extends Component {

    exampleSearch = (ev) => {
        const { handleExample } = this.props;
        handleExample(ev)
    }
    render() {
        const { handleInput, handleSearch, inputText, handleExample } = this.props;
        const { exampleSearch } = this;
        return (
            <div className='jumbotron'>
                <h1 className='display-3'>r/sampleDigger</h1>
                &nbsp;
                <p className='lead'>1. Enter subreddit name</p>
                <p className='lead'>2. Browse and download YouTube posts</p>
                <p className='lead'>3. Sample Away</p>
                <hr className='my-4'/>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{display:'flex'}}>
                        <h3>r/&nbsp;</h3><input value={ inputText } onChange={ handleInput }></input>
                    </div>
                    <Link className='resultsButton' to='/results'><button value={ inputText }onClick={ handleSearch }className='digButton'>Let's Dig</button></Link>
                    <Link className='resultsButton' to='/results'><button value='vintageobscura' onClick={ handleSearch } className='exampleButton'>Try it with r/vintageobscura</button></Link>
                </div>
            </div>
        )
    }
}

class App extends Component {

    state = { 
        posts: [],
        inputText: '',
        searchVal: '',
    }

    handleInput = (ev) => {
        this.setState({inputText: ev.target.value});
        // console.log(this.state.inputText)
    }

    handleSearch = (ev) => {
        this.setState({searchVal: ev.target.value});
    }

    render() {
        const { inputText, searchVal } = this.state;
        const { handleInput, handleSearch } = this;
        return (
            <div className='container'>
                <HashRouter>
                    <Switch>
                        <Route exact path='/' render={ () => <Home handleInput={ handleInput } handleSearch={ handleSearch } inputText={ inputText } /> } />
                        <Route path='/results' render={ () => <PageBody searchVal={ searchVal } inputText={ inputText }/>} />
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}

render (
    <App />,
    app,
)




// class PageBody extends Component {


//     render() {
//         const { posts, searchVal } = this.props;
//         // console.log(posts);
//         return (
//             <div className='container'>
//                 <div style={{display:'flex'}}>
//                     <Link to='/'><button className='digButton'>Go Back</button></Link>
//                     <h1 className='resultsHeader'>You are digging r/{ searchVal }</h1>
//                 </div>
//                     {
//                         posts.map((post, idx) => {
//                             const leftTagRegEx = /&lt;/gi;
//                             const rightTagRegEx = /&gt;/gi;
//                             let mediaEmbed = post.data.secure_media_embed.content.replace(leftTagRegEx, '<');
//                             mediaEmbed = mediaEmbed.replace(rightTagRegEx, '>')
//                             // console.log(mediaEmbed)
//                             const videoId = post.data.url.slice(-11);
//                             // const videoId = post.data.url;
//                             // console.log(videoId)
//                             // const downloadButtonIFrame = `<iframe src="https://ytmp3.bid/button/?v=${ videoId }&fc=ffffff&bc=000000" scrolling="no" style="width:300px;height:60px;border:none;"></iframe>`
//                             // const downloadButtonIFrame = `<iframe style="width:100%;min-width:200px;max-width:350px;height:57px;border:0;overflow:hidden;" src="//ytmp3.mobi/button-api/#${ videoId }" scrolling="no" style="border:none"></iframe>`
//                             // const downloadButtonIFrame = `<iframe class="button-api-frame" src="https://api.download-lagu-mp3.com/@api/button/mp3/${ videoId }" width="100%" height="100%" allowtransparency="true" scrolling="no" style="border:none"></iframe>`
//                             // const downloadButtonIFrame = `<iframe src="https://mp3downy.com/MP3-converter?apikey=1234567890&color=17a2b8&bg=ffffff" style="width:100%;min-height:250px;height:auto;" ></iframe>`
//                             // const downloadButtonIFrame = `<iframe src="https://api.youtube-mp3.org.in/widget/button/audio/${ videoId }" frameborder="0" style="width: 160px; height: 50px;"></iframe>`
//                             const downloadButtonIFrame = `<iframe style="width:100%;min-width:200px;max-width:350px;height:57px;border:0;overflow:hidden;" scrolling="no" src="//break.tv/widget/button/?link=https://www.youtube.com/watch?v=${ videoId }&color=DA4453&text=fff"></iframe> 
//                             `
//                             function createEmbed() {
//                                 return {__html: `${ mediaEmbed }`}
//                             }
//                             function createDownloadButton() {
//                                 return {__html: downloadButtonIFrame }
//                             }
//                             return (
//                                 <div key={ idx }className='videoCard'>
//                                     <div className='videoWrapper'>
//                                         <div dangerouslySetInnerHTML={ createEmbed() } />
//                                         <div dangerouslySetInnerHTML={ createDownloadButton() } />
//                                         {/* <button onClick={ () => downloadMp3(videoId) }className='downloadButton'>Download MP3</button> */}
//                                     </div>
//                                     <div>
//                                         <h2 style={{textAlign:'center'}}>{ post.data.secure_media.oembed.title }</h2>
//                                     </div>
//                                 </div>   
//                             )
//                         })
//                     }
//             </div>
//         )
//     }
// }

// class Home extends Component {
//     render() {
//         const { handleInput, handleSearch, inputText, handleExample } = this.props;
//         return (
//             <div className='jumbotron'>
//                 <h1 className='display-3'>r/sampleDigger</h1>
//                 &nbsp;
//                 <p className='lead'>1. Enter subreddit name</p>
//                 <p className='lead'>2. Browse and download YouTube posts</p>
//                 <p className='lead'>3. Sample Away</p>
//                 <hr className='my-4'/>
//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <div style={{display:'flex'}}>
//                         <h3>r/&nbsp;</h3><input value={ inputText } onChange={ handleInput }></input>
//                     </div>
//                     <Link to='/results'><button value={ inputText }onClick={ handleSearch }className='digButton'>Let's Dig</button></Link>
//                     <Link to='/results' onClick={ handleExample }>Try it with r/vintageobscura</Link>
//                 </div>
//             </div>
//         )
//     }
// }

// class App extends Component {

//     state = { 
//         posts: [],
//         inputText: '',
//         searchVal: '',
//     }

//     downloadMp3 = (videoId) => {
//         fetch(`https://api.download-lagu-mp3.com/@api/json/audiostreams/${ videoId }`)
//         .then(res => {
//             console.log(res)
//         })
//     }

//     componentDidUpdate(prevProps, prevState) {
//         if (prevState.searchVal === this.state.searchVal) {
//             return;
//         } else {
//             fetch(`https://www.reddit.com/r/${ this.state.searchVal }/hot/.json`)
//             .then(res => res.json())
//             .then(data => {
//                 const postList = data.data.children;
//                 console.log(postList)
//                 this.setState({
//                     posts: postList.filter(post => {
//                         if (post.data.secure_media !== null) {
//                             return post;
//                         }
//                     })
//                 })
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         }
//     }

//     handleInput = (ev) => {
//         this.setState({inputText: ev.target.value});
//         console.log(this.state.inputText)
//     }

//     handleSearch = (ev) => {
//         this.setState({searchVal: ev.target.value});
//     }

//     handleExample = (ev) => {
//         this.setState({searchVal: ev.target.value, inputText: ev.target.value})
//     }

//     render() {
//         const { inputText, posts, searchVal, handleExample } = this.state;
//         const { handleInput, handleSearch } = this;
//         return (
//             <div className='container'>
//                 <HashRouter>
//                     <Switch>
//                         <Route exact path='/' render={ () => <Home handleInput={ handleInput } handleSearch={ handleSearch } inputText={ inputText } handleExample={ handleExample }/> } />
//                         <Route path='/results' render={ () => <PageBody posts={ posts } searchVal={ searchVal }/>} />
//                     </Switch>
//                 </HashRouter>
//             </div>
//         )
//     }
// }

// render (
//     <App />,
//     app,
// )