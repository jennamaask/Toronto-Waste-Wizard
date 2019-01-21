//return results that match user's search
const getInfo = function(search) {
		$.ajax({
			url:'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000',
		}).then(function(data){
			const keyWord = data.filter((i) =>{
				return i.keywords.includes(search);
			});
			printSearchResults(keyWord);
			
		});		
	}

//translate and return results, as well as check if the result list contains any items that have been favourited
const printSearchResults = function(results) {
	const resultsHtml = results.map(function(item){
		let description = item.body.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
		let individualClass = item.title.replace(/\s+/g, '').replace(/\(|\)/g, '');
		console.log(individualClass);
		if($('.favourites').find('div').hasClass(individualClass)){
			starClass='star green';
		} else {
			starClass='star';
		}
		let resultsItemHtml = 
		`<div class="resultItem ${individualClass}">
			<div class="itemTitle">
				<svg class="${starClass}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 673 806.25" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd"><defs><style type="text/css">
				   
				    .fil0 
					   
				  </style></defs><g><path class="fil0" d="M375 27l82 158 188 32c31,6 36,43 15,68l-130 130 25 169c10,54 -22,74 -67,52l-152 -79 -151 79c-45,22 -77,2 -67,-52l24 -169 -129 -130c-21,-25 -16,-62 15,-68l188 -32 82 -158c15,-35 61,-37 77,0z"/></g></svg>
				<p class="name">${item.title}</p>
			</div>
			<div class="description">${description}</div>
		</div>`
		return resultsItemHtml;
	}).join('');
	$('.results').append(resultsHtml);
	emptySearchBar();
	getFavourite();
}

//clear result list and get user's input values
const getUserInput = function(){
	$('#submit').on("click", function(event) {
		event.preventDefault();
		$('.results').html('');
		let userSearch = $('#search').val();
		getInfo(userSearch);
	});
}

//change color of star when it is clicked and add to favourites list
const getFavourite = function(){
	$('.star').on("click", function() {		
		let clickedClass = this.getAttribute('class');	
		let individualClass = $(this).next().text().replace(/\s+/g, '').replace(/\(|\)/g, '');
		if(clickedClass == "star green") {
			$(this).attr('class', 'star');
			let remove = $('.favourites').find(`.${individualClass}`).remove();
			if($('.favourites').find('.resultItem').length == 0){
				$('.favourites').find('h2').removeClass('visible');
			}
		} else {
			if($('.favourites').find('h2').hasClass('visible')){
			} else {
				$('.favourites').find('h2').addClass('visible');
			}
			$(this).attr('class', 'star green');
			$(this).parent('div').parent('div').clone().appendTo($('.favourites'));
			watchFavourites();
		}
	});	
}

//remove favourite item when star is clicked and change color of star in results list
const watchFavourites = function() {
	$('.favourites').on('click', '.star', function() {
		let clickedClass = $(this).next().text().replace(/\s+/g, '').replace(/\(|\)/g, '');
		$(this).parent('div').parent('div').remove();
		$('.results').find(`.${clickedClass}`).find('.star').attr('class', 'star');
		if($('.favourites').find('.resultItem').length == 0){
				$('.favourites').find('h2').removeClass('visible');
			}
	});
}

//detect if search bar is empty and clear results if it is true
const emptySearchBar = function(){		
	$('#search').on('keyup', function(){
		const key = event.keyCode || event.charCode;
		if (key == 8 || key == 46) {
			if($('#search').val() ==""){
				$('.results').html('');
			}
		}
	});
}
	
$(function(){
	getUserInput();
})
