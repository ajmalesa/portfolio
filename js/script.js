// Get the latest commit from GitHub and display on page
let xhttp = new XMLHttpRequest();
let latestCommitMessage;
let latestCommitTime;
let latestCommitLink;
let latestCommitProject;
let lastEvent;

// Add event listener to request, so HTML is updated only if we receive 
// a successful response and request is complete (status = 200 & readyState = 4)
xhttp.addEventListener('readystatechange', (e) => {

    if (xhttp.readyState === 4 && xhttp.status === 200) {
        // Grab the last event
        lastEvent = JSON.parse(xhttp.responseText)[0];
    
        // If the last event was a push, run this
        if (lastEvent.type === "PushEvent") {
            // Only add commit details class to commit section if there was a push
            // event. Commit detials class will add margin to the top on mobile
            document.querySelector("#commit-section").classList.add("commit-details");
    
            // Grab the latest commit details
            latestCommitLink = lastEvent.repo.name;
            latestCommitMessage = lastEvent.payload.commits[0].message;
            latestCommitTime = new Date(lastEvent.created_at);
            latestCommitProject = lastEvent.repo.name.split('/')[1];
    
            // Make a link variable to repo by prepending github domain to repo name
            latestCommitLink = "https://github.com/" + latestCommitLink;
    
            // Update text to show latest commit details
            document.querySelector("#latest-commit-display").innerHTML = "Latest Commit";
            document.querySelector("#latest-commit-project").innerHTML = latestCommitProject;
            document.querySelector("#latest-commit-message").innerHTML = latestCommitMessage;
            document.querySelector("#latest-commit-time").innerHTML = latestCommitTime.toLocaleString();
    
            // Update link to URL created above
            document.querySelector("#latest-commit-link").href = latestCommitLink;
        }
    }
});

// Send GET request to events endpoint of GitHub API
xhttp.open("GET", "https://api.github.com/users/ajmalesa/events", true);
xhttp.send();

// Add active class on selected section and remove active class on all other desktop nav menu items 
document.getElementById('skills-button').addEventListener('click', function() {
    this.parentElement.classList.add('uk-active');
    document.getElementById('projects-button').parentElement.classList.remove('uk-active');
    document.getElementById('about-button').parentElement.classList.remove('uk-active');
});
document.getElementById('projects-button').addEventListener('click', function() {
    this.parentElement.classList.add('uk-active');
    document.getElementById('skills-button').parentElement.classList.remove('uk-active');
    document.getElementById('about-button').parentElement.classList.remove('uk-active');
});
document.getElementById('about-button').addEventListener('click', function() {
    this.parentElement.classList.add('uk-active');
    document.getElementById('skills-button').parentElement.classList.remove('uk-active');
    document.getElementById('projects-button').parentElement.classList.remove('uk-active');
});

// Add active class on selected section and remove active class on all other mobile nav menu items 
document.getElementById('skills-button-mobile').addEventListener('click', function() {
    this.parentElement.classList.add('uk-active');
    document.getElementById('projects-button-mobile').parentElement.classList.remove('uk-active');
    document.getElementById('about-button-mobile').parentElement.classList.remove('uk-active');
});
document.getElementById('projects-button-mobile').addEventListener('click', function() {
    this.parentElement.classList.add('uk-active');
    document.getElementById('skills-button-mobile').parentElement.classList.remove('uk-active');
    document.getElementById('about-button-mobile').parentElement.classList.remove('uk-active');
});
document.getElementById('about-button-mobile').addEventListener('click', function() {
    this.parentElement.classList.add('uk-active');
    document.getElementById('skills-button-mobile').parentElement.classList.remove('uk-active');
    document.getElementById('projects-button-mobile').parentElement.classList.remove('uk-active');
});

// Expand all skills when show all button is clicked
document.getElementById('show-all-button').addEventListener('click', function() {
    // Go through each element that has a class of accordion
    document.querySelectorAll('.accordion').forEach(
        element => {
            // Only going to toggle this accordion if it's children are closed
            if (!element.children[0].classList.contains('uk-open')) {
                // Use UIkit's toggle method to change state of accordion 
                UIkit.accordion(element).toggle();
            }
        }
    );
});

// Collapse all skills when hide all button is clicked
document.getElementById('hide-all-button').addEventListener('click', function() {
    // Go through each element that has a class of accordion
    document.querySelectorAll('.accordion').forEach(
        element => {
            // Only going to toggle this accordion if it's children are already opened
            if (element.children[0].classList.contains('uk-open')) {
                // Use UIkit's toggle method to change state of accordion 
                UIkit.accordion(element).toggle();
            }
        }
    );
});

// Prevent the default action on show all and hide all buttons so page does not scroll on click
document.getElementById("show-all-button").addEventListener("click", function(event){
    event.preventDefault()
    document.getElementById("show-all-button").parentNode.classList.add("uk-active");
    document.getElementById("hide-all-button").parentNode.classList.remove("uk-active");
});
document.getElementById("hide-all-button").addEventListener("click", function(event){
    event.preventDefault()
    document.getElementById("hide-all-button").parentNode.classList.add("uk-active");
    document.getElementById("show-all-button").parentNode.classList.remove("uk-active");
});

// Validate contact form
function validateContactForm() {
    if (
        document.querySelector("#contact-email").value.length > 0 && 
        document.querySelector("#contact-message").value.length > 0 && 
        document.querySelector("#my-name").value === "Ajmal"
    ) {    
        return true;
    } 
    else  {
        return false;
    }
}

// Send message using AJAX when send message button is clicked 
document.querySelector("#send-message-button").addEventListener("click", function() { 

    // Only send contact message if form validates
    if (validateContactForm()) {
        document.querySelector("#send-message-button").setAttribute("disabled", "true");

        const form = new FormData(document.getElementById('contact-form'));
        fetch('/functions/contact-request.php', {
            method: 'POST',
            body: form
        });
    
        // Erase message value after in case they click send message again
        document.querySelector("#contact-message").value = "";
    
        // Change send message button to show user feedback that their message was sent
        document.querySelector("#send-message-button").innerHTML = "MESSAGE SENT <span class='green-text'>&#x2713;</span>";
        document.querySelector("#send-message-button").style.color = "#c1c1c1";
    
        // Hide contact modal after set interval
        setTimeout(function() {
            UIkit.modal(document.querySelector("#contact-modal")).hide();
            document.querySelector("#send-message-button").style.color = "#c1c1c1";
            document.querySelector("#send-message-button").innerHTML = "SEND MESSAGE";
        }, 1500);
    } else {
        if (document.querySelector("#contact-email").value.length < 1) {
            document.querySelector("#contact-email").focus();
        } else if (document.querySelector("#contact-message").value.length < 1) {
            document.querySelector("#contact-message").focus();
        } else if (document.querySelector("#my-name").value !== "Ajmal") {
            document.querySelector("#my-name").focus();
        }
    }
});

/** Generate random number in range */
function randomNumberInRange(min, max) {  
    return Math.round(Math.random() * (max - min) + min); 
}  

// Use normal color as fallback when browser does not support gradient
document.querySelector("html").style.background = "rgb(240,63,63)";

// Use same random number for color so we can match it with other page colors
let topOfPageColorRed       = randomNumberInRange(0, 40);
let topOfPageColorGreen     = randomNumberInRange(0, 40);
let topOfPageColorBlue      = randomNumberInRange(0, 40);
let middleOfPageColorRed    = randomNumberInRange(0, 40);
let middleOfPageColorGreen  = randomNumberInRange(0, 40);
let middleOfPageColorBlue   = randomNumberInRange(0, 40);
let bottomOfPageColorRed    = randomNumberInRange(0, 255);
let bottomOfPageColorGreen  = randomNumberInRange(0, 255);
let bottomOfPageColorBlue   = randomNumberInRange(0, 255);
  
// generate random background radiant color
document.querySelector("html").style.background = `
    linear-gradient(
        0deg, 
        rgb(${bottomOfPageColorRed}  
            ${bottomOfPageColorGreen}
            ${bottomOfPageColorBlue} / 15%) 0%,
        rgb(${middleOfPageColorRed}  
            ${middleOfPageColorGreen}
            ${middleOfPageColorBlue} / 15%) 49%,
        rgb(${topOfPageColorRed} 
            ${topOfPageColorGreen}
            ${topOfPageColorBlue} / 6%) 100%
        )
    `;
document.querySelector("html").style.backgroundAttachment = "fixed";

// use random solid color for mobile and desktop navbar
document.querySelectorAll(".uk-navbar")[0].style.background = `
    rgb(${topOfPageColorRed}, 
        ${topOfPageColorGreen}, 
        ${topOfPageColorBlue}, .92)
`;
document.querySelectorAll(".uk-offcanvas-bar")[0].style.background = `
    rgb(${topOfPageColorRed}, 
        ${topOfPageColorGreen}, 
        ${topOfPageColorBlue}, .99)
`;

// Apply randomly generated colors to box shadows of projects
let ukInlineClips = document.querySelectorAll(".uk-inline-clip");
ukInlineClips.forEach(function(ukInlineClip) {
    ukInlineClip.style.boxShadow = `5px 5px 6px 3px 
        rgb(${topOfPageColorRed} 
            ${topOfPageColorGreen}
            ${topOfPageColorBlue} / 38%`;
});

// Apply randomly generated colors to box shadows of navbar
document.querySelector(".uk-navbar").style.boxShadow = `0px 4px 6px 3px 
    rgb(${topOfPageColorRed} 
        ${topOfPageColorGreen}
        ${topOfPageColorBlue} / 38%`;

// Apply randomly generated colors to scrollbar, buttons and badges
document.querySelector("#scrollbar-style").innerHTML += `
    body::-webkit-scrollbar {
        width: 12px;   
        background: rgb(${topOfPageColorRed}, 
                        ${topOfPageColorGreen}, 
                        ${topOfPageColorBlue}, .92); 
    }
    body::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, rgb(${topOfPageColorRed + 150},
                                                ${topOfPageColorGreen + 150}, 
                                                ${topOfPageColorBlue + 150}, .99), 
                                            rgb(${bottomOfPageColorRed + 150}, 
                                                ${bottomOfPageColorGreen + 150}, 
                                                ${bottomOfPageColorBlue + 150}, .6));
        border-radius: 20px;
    }
    body::-webkit-scrollbar-track {
        background: linear-gradient(0deg,   rgb(${bottomOfPageColorRed}, 
                                                ${bottomOfPageColorGreen}, 
                                                ${bottomOfPageColorBlue}, .15), 
                                            rgb(${topOfPageColorRed}, 
                                                ${topOfPageColorGreen}, 
                                                ${topOfPageColorBlue}, .15));
    }

    .uk-subnav-pill>*>a:focus, .uk-subnav-pill>*>a:hover {
        background: rgb(${topOfPageColorRed}, 
                        ${topOfPageColorGreen}, 
                        ${topOfPageColorBlue}, .85);
        color: white!important;
    }

    .uk-subnav-pill>.uk-active>a {
        background: rgb(${topOfPageColorRed}, 
                        ${topOfPageColorGreen}, 
                        ${topOfPageColorBlue}, .85);
        color: #fff;
    }

    .uk-badge {
        background: rgb(${topOfPageColorRed}, 
                        ${topOfPageColorGreen}, 
                        ${topOfPageColorBlue}, .65);
    }

    .project-badge {
        background: rgb(${topOfPageColorRed + 50}, 
                        ${topOfPageColorGreen + 50}, 
                        ${topOfPageColorBlue + 50}, .5);
    }

    .contact-body, .contact-header, .project-details-header, .project-details-body, .project-details-footer {
        background: rgb(${topOfPageColorRed}, ${topOfPageColorGreen}, ${topOfPageColorBlue}, .65);
    }

    .contact-body, .project-details-body, .project-details-footer {
        border-top: 1px solid rgb(  ${topOfPageColorRed + 100}, 
                                    ${topOfPageColorGreen + 100}, 
                                    ${topOfPageColorBlue + 100}, .75);
    }

    #send-message-button {
        border: 1px solid rgb(  ${topOfPageColorRed + 100}, 
                                ${topOfPageColorGreen + 100}, 
                                ${topOfPageColorBlue + 100}, .75);
        background-color: rgba(255,255,255,.1);
    }
    
    html {
        scrollbar-color: 
            rgb(${topOfPageColorRed + 150},
                ${topOfPageColorGreen + 150}, 
                ${topOfPageColorBlue + 150}, .99) 
            rgb(${topOfPageColorRed}, 
                ${topOfPageColorGreen}, 
                ${topOfPageColorBlue}, .92) 
            !important;
        scrollbar-width: 10px!important;
    }
`;

// Apply randomly generated colors to project overlays as well
let projectOverlays = document.querySelectorAll(".custom-overlay-color");
projectOverlays.forEach(function(projectOverlay) {
    projectOverlay.style.background = `rgb(${topOfPageColorRed}, 
                                           ${topOfPageColorGreen}, 
                                           ${topOfPageColorBlue}, .8 )`;
});

// Add animations after mouse hovers over project because css :hover 
// animation requires animation to run on page load 
let popouts = document.querySelectorAll(".waiting-for-popout");
popouts.forEach(function(popout) {
    popout.addEventListener('mouseenter', function(e) {
        popout.classList.add('popout');
    });
    popout.addEventListener('mouseleave', function(e) {
        popout.classList.remove('popout');
    });
});
