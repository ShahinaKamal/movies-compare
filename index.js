const autoCompleteconfig={
    renderOption(movie){
        const imgSrc= (movie.Poster==="N/A")?'':movie.Poster;
        const movieTitle=(movie.Title==="N/A")?'':movie.Title;
        return`<img src="${imgSrc}"/>
            <h1>${movieTitle}(${movie.Year})</h1>`;
    },   
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(search) {
            const response = await axios.get('http://www.omdbapi.com/', {
                params: {
                    apikey: '490024a3',
                    s: search                }
            });
            //When no matching string movie is found
            if (response.data.Error) {
                return [];
            }
            return response.data.Search;
    }     
}
createAutocomplete({
    ...autoCompleteconfig,
    root:document.querySelector('#autocomplete-left'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector("#summary-left"),"left");
    }      
});
createAutocomplete({
    ...autoCompleteconfig,
    root:document.querySelector('#autocomplete-right'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector("#summary-right"),"right");
    }      
});
let movieLeft;
let movieRight;
//Retrieve specific movie details using OMDB API 
const onMovieSelect=async (movie,summary,side)=>{
    const response=await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey: '490024a3',
            i:movie.imdbID
        }
    });
    summary.innerHTML=movieTemplate(response.data);
    if(side==="left"){
        movieLeft=response.data;
    }
    else{
        movieRight=response.data;
    }
    if(movieLeft && movieRight){
        console.log("if running comparision")
        runComparision();
    }

};
const runComparision=()=>{
    const leftSideStats=document.querySelectorAll('#summary-left .notification');
    const rightSideStats=document.querySelectorAll('#summary-right .notification');
    leftSideStats.forEach((leftStat,index)=>{
        const rightStat=rightSideStats[index];
        const leftDatasetVal=parseInt(leftStat.dataset.value);
        const rightDatasetVal=parseInt(rightStat.dataset.value);
        leftStat.classList.remove('summary-highlight');
        leftStat.classList.add('is-primary');
        rightStat.classList.remove('summary-highlight');
        rightStat.classList.add('is-primary');
       if(!isNaN(leftDatasetVal) && !isNaN(rightDatasetVal)){
         if(leftDatasetVal>rightDatasetVal){
             console.log('left',leftDatasetVal);
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('summary-highlight');
        }
        else{
            console.log('right',rightDatasetVal);
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('summary-highlight');
        } 
    }
    });
}
const movieTemplate=(movieDetail)=>{
    const rating=parseFloat(movieDetail.imdbRating);
    const metascore=parseInt(movieDetail.Metascore);
    let dollars="N/A";
    if(!isNaN(parseInt(movieDetail.BoxOffice))){
     dollars=parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'') )  ;
    }
    
    let imdbVotes='';
    if(!isNaN(parseInt(movieDetail.imdbVotes))){
        imdbVotes=parseInt(movieDetail.imdbVotes.replace(/,/g,'') )  ;
       }
    const awards=movieDetail.Awards.split(' ');
    let totalAwards=0;
    awards.forEach((val)=>{        
        if(!isNaN(parseInt(val))){
            totalAwards=totalAwards+parseInt(val);
        }       
    });
   return `
    <article class="media brand-height">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"
             </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p> ${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article data-value=${totalAwards} class="notification is-primary article-height">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary article-height">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box-Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary article-height">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article  data-value=${rating} class="notification is-primary article-height">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary article-height">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
   `
};

