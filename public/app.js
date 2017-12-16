
// let gardenItemTemplate = (
// 	//form template for how plant info will display
// 	'<div class="plantItem">' +
// 		'<p class="plantName"></p>' +
// 		'<div class="plantInfo">' +
// 			'<p class="startDate"></p>' +
// 			'<p class="harvestDate"></p>' +
// 			'<p class="plantComments"></p>' +
// 			'<button type="submit" class="updatePlant">Update</button>' +
// 			'<button type="submit" class="deletePlant">Delete</button>' +
// 		'</div>' +
// 	'</div>'
// );

let serverBase = '//localhost:8080/';
let GARDEN_URL = serverBase + 'garden';
let user = localStorage.getItem('currentUser');

function getGarden(userGardenArray) {
	console.log('Getting garden info')
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${GARDEN_URL}/user/${user}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(userData) {
			console.log(userData);
			showGardenResults(userData);
		}
	});

function showGardenResults(plantArray) {

	$('#showName').html(user);
	let buildPlantList = "";

	$.each(plantArray, function (plantArrayKey, plantArrayValue) {
		buildPlantList += `<div class="plantItem">` 
		buildPlantList += `<p class="plantName">${plantArrayValue.name}</p>`
		buildPlantList += `<div class="plantInfo">` 
		buildPlantList += `<p class="startDate">${plantArrayValue.startDate}</p>` 
		buildPlantList += `<p class="harvestDate">${plantArrayValue.harvestDate}</p>` 
		buildPlantList += `<p class="plantComments">${plantArrayValue.comments}</p>` 
		buildPlantList += `</div>` 
		buildPlantList += `</div>`

		$('.plantListSection').html(buildPlantList);
	});
}


// 	$.getJSON(`${GARDEN_URL}/user/${user}`, function(gardens) {
// 		console.log(`Rendering ${user}'s garden`);
// 		let gardenElement = gardens.map(function(garden) {
// 			let element = $(gardenItemTemplate);
// 			element.attr('id', garden.id);
// 			// don't need to set attr for name
// 			let plantName = element.find('.plantName');
// 			// plantName found; set to garden.name
// 			plantName.text(garden.name);
// 			let plantStartDate = element.find('.startDate');
// 			plantStartDate.text(garden.startDate)
// 			let plantHarvestDate = element.find('.harvestDate');
// 			plantHarvestDate.text(garden.harvestDate)
// 			let plantComments = element.find('.plant-comments');
// 			plantComments.text(garden.comments)
// 		});
// 		// return element here?
// 		$('.plantSection').html(gardenElement);
// 	});
	}

function addPlant(plant) {
	console.log('Adding plant' + plant);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: GARDEN_URL,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify(plant),
		success: function(data) {
			getGarden(data);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
	// add error callback
}

function updatePlant(plant) {
	console.log('updating plant' + garden.id);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: GARDEN_URL + '/' + garden.id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		data: garden,
		success: function(data) {
			getGarden();
		}
	});
	// add error callback
}

function deletePlant(plant) {
	console.log('deleting plant' + garden.id);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: GARDEN_URL + '/' + garden.id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'DELETE',
		success: getGarden()
	});
	// add error callback
}



function handlePlantAdd() {
  $('#addPlantSection').submit(function(e) {
    e.preventDefault();
    addPlant({
    	user: user,
    	name: $(e.currentTarget).find('#addPlantName').val(),
    	startDate: $(e.currentTarget).find('#addStartDate').val(),
    	harvestDate: $(e.currentTarget).find('#addHarvestDate').val(),
    	comments: $(e.currentTarget).find('#addComments').val()
    });
    // hide add plant form - do I need to put all of these in?
    $("#updatePlantSection").hide();
	$("#addPlantSection").hide();
	$("#plantListSection").show();
  });
}

function handlePlantUpdate() {
	$('#updatePlantInfo').on('click', function(e) {
		e.preventDefault();
		updatePlant({
			// figure out # for .find()
			name: $(e.currentTarget).find('#').val(),
		});
	});
}

function handlePlantDelete() {
	$('.plantListSection').on('click', '.delete-plant', function(e) {
		e.preventDefault();
		deletePlant(
			$(e.currentTarget).closest('.plantSection').attr('id'));
	});
}



$(document).ready(function() {

// on landing page, hide #login-page and #register-page; show #login-section and #detail-section

	$("#login-page").hide();
	$("#register-page").hide();
	$(".login-section").show();
	$(".detail-section").show();

	$("#login-button").click(function() {
		$("#register-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#login-page").show();
	})

	$("#register-link").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#register-page").show();
	}) 

	$("#register-button").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#register-page").show();
	})

// LOGIN - issue a POST request to path api-auth-login set header with key authorization and Basic encoding, to return a JWT
	// save in local storage
	// later when you want to send a request, will send request to BEARER + token

// #sign-in

	$("#loginForm").submit(function(e) {
		e.preventDefault();
		let username = $("#GET-username").val();
		let password = $("#GET-password").val();
		let user = {username, password};
		// console.log("client-side user:" user) <= broke code
		let settings = {
			url:"/auth/login",
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				console.log('successfully logged in');
				localStorage.setItem("authToken", data.authToken);
				// tells me who the user is and their own records
				// can set in named parameter 
				localStorage.setItem("currentUser", username);
				window.location = "home.html";
				// ADDED 12.15.17
				getGarden(user);
			},
			error: function(err) {
				console.log(err);
				// instead can write separate function 'handleError(err)'
			}
		};
		$.ajax(settings);
	}) 

// #sign-up
	$("#registerForm").submit(function(e) {
		e.preventDefault();
		let username = $("#POST-username").val();
		console.log('client-side username is:', username);
		let password = $("#POST-password").val();
		let retypePass = $("#retype-password").val();
		let user = {username, password};
		let settings = {
			url:"/users/",
			type: 'POST',
			// application/json - make sure is forward slash
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				console.log('successfully registered')
				$("#register-page").hide();
				$(".login-section").hide();
				$(".detail-section").hide();
				$("#login-page").show();
			},
			error: function(err) {
				console.log(err);
			}
		};
		$.ajax(settings);
	})


// on home page, hide #updatePlantSection and #addPlantSection, show plantListSection

	$("#updatePlantSection").hide();
	$("#addPlantSection").hide();
	$("#plantListSection").show();

// on update:  #update-plant

	$(".update-plant").click(function() {
		$("#addPlantSection").hide();
		$("#plantListSection").show();
		$("#updatePlantSection").show();
	})

// on add:  #add-plant
	$("#add-plant").click(function() {
		$("#updatePlantSection").hide();
		$("#plantListSection").show();
		$("#addPlantSection").show();
	})

	// additional property in record:  user = localStorage.getItem...

	// api call 

	$(function() {

		// will move to another spot where needed
		// addPlant();
		// updatePlant();
		// deletePlant();
		handlePlantAdd();
		handlePlantUpdate();
		handlePlantDelete();
	})

})

	