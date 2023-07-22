//DEFINING USEFUL CONSTANTS AND VARIABLES
const twelveNotesString = [["C5","C#5","Db5","D5","D#5","Eb5","E4","F4","F#4","Gb4","G4","G#4","Ab4","A4","A#4","Bb4","B4"], //1st string
                           ["C4","C#4","Db4","D4","D#4","Eb4","E4","F4","F#4","Gb4","G4","G#4","Ab4","A4","A#4","Bb4","B3"], //2nd string
                           ["C4","C#4","Db4","D4","D#4","Eb4","E4","F4","F#4","Gb4","G3","G#3","Ab3","A3","A#3","Bb3","B3"], //3rd string
                           ["C4","C#4","Db4","D3","D#3","Eb3","E3","F3","F#3","Gb3","G3","G#3","Ab3","A3","A#3","Bb3","B3"], //4th string
                           ["C3","C#3","Db3","D3","D#3","Eb3","E3","F3","F#3","Gb3","G3","G#3","Ab3","A2","A#2","Bb2","B2"], //5th string
                           ["C3","C#3","Db3","D3","D#3","Eb3","E2","F2","F#2","Gb2","G2","G#2","Ab2","A2","A#2","Bb2","B2"], //6th string
                           ];
var rootNote="noRootGenerated"; //initial root note
var inversion=0; //current inversion of the triad
var currentTriad=0; //current triad type
var currentStringNumber=3; //current string
var metronomeDisabled=0; //flag
var triadsplayAlongDisabled=0; //flag
var playAlongDisabled=1; //flag
var fretboardDisabled=0; //flag
var mode=-1; //current mode
const playSound = new Tone.PolySynth(Tone.AMSynth).toDestination(); //polysynth audio sent to the speakers
playSound.volume.value=5; //adjusting volume



//handling metronome sound samples and their sound intensity
var beat=[];
beat[0] = new Audio('beat.mp3');
beat[1] = new Audio('beat.mp3');
beat[1].volume = 0.4;
beat[2] = new Audio('beat.mp3');
beat[2].volume = 0.4;
beat[3] = new Audio('beat.mp3');
beat[3].volume = 0.4;

beat[4] = new Audio('beat.mp3');
beat[5] = new Audio('beat.mp3');
beat[5].volume = 0.4;
beat[6] = new Audio('beat.mp3');
beat[6].volume = 0.4;
beat[7] = new Audio('beat.mp3');
beat[7].volume = 0.4;

beatCount=0; //keeps track of the current beat
var milliseconds=1000*60/document.getElementById("myRange").value; //milliseconds between two consecutive notes




//MODE BUTTONS

var btn = document.getElementById('btn')

//left mode button
function leftClick() {
	btn.style.left = '0'
    document.getElementById("rightClickButton").style.color="#000";    
    document.getElementById("leftClickButton").style.color="#f6ecfc";
}

//right mode button
function rightClick() {
	btn.style.left = '350px'

    document.getElementById("leftClickButton").style.color="#000";    
    document.getElementById("rightClickButton").style.color="#f6ecfc";
}






//DISPLAY TRIADS ON SCREEN

//displays the new triad/chord on the screen
function displayNewTriad(){
    if(mode==1){
        isPlayingPractice=0;
        document.getElementById("playIcon").style.visibility="visible";
        document.getElementById("stopIcon").style.visibility="hidden";
    }
    var selectedNotes = [];
    var selectedTriads = [];
    var selectedStrings = [];


    //creating the pool of notes as selected in the checkbox
    var checkboxes1 = document.querySelectorAll('input[name="17notes"]:checked');
    checkboxes1.forEach((checkbox) => {
        selectedNotes.push(checkbox.value);
    });

    var checkboxes2 = document.querySelectorAll('input[name="4triads"]:checked');
    checkboxes2.forEach((checkbox) => {
        selectedTriads.push(checkbox.value);
    });
    
    var checkboxes3 = document.querySelectorAll('input[name="4strings"]:checked');
    checkboxes3.forEach((checkbox) => {
        selectedStrings.push(checkbox.value);
    });


    var currentStringText=generateRandomString(selectedStrings);
    var currentTriadText=generateRandomTriad(selectedTriads);
    var currentNoteWithNumber = ((generateRandomNoteFromString(currentStringNumber,selectedNotes)));
    var currentNoteWithoutNumber = currentNoteWithNumber.substring(0,currentNoteWithNumber.length-1); //removing the note number so that the user
                                                                                 //is not confused when playing the instrument
 
    document.getElementById("displaytriad").innerHTML = currentNoteWithoutNumber + currentTriadText;
    document.getElementById("displaystring").innerHTML = currentStringText;
    plotFretboard();
    return;
}

//generates a new triad type after considering the checkboxes value
function generateRandomTriad(selectedTriads){
    const triadsArray = [" Maj"," Min"," Aug"," Dim"]; //all the 4 possible triads
    var i=0;

    if(selectedTriads.length==0) {alert("no triad type selected :c")};

    var triadsSelection=[];
     while(i<selectedTriads.length){
        triadsSelection.push(triadsArray[selectedTriads[i]]);
        i++;
    }
    
    const randomIndex = Math.floor(Math.random()*triadsSelection.length); //choosing one random triad among the four
    currentTriad=parseInt(selectedTriads[randomIndex]);
    return triadsSelection[randomIndex];
}

//generates a new note after considering the checkboxes value and after considering which is the selected string
function generateRandomNoteFromString(stringNumber,selectedNotes){
    
    const NotesArray = getAvailableNotesFromString(stringNumber,selectedNotes);

    if(selectedNotes.length==0) {alert("no note selected :c")};

    // get a random index value
    const randomIndex = Math.floor(Math.random()*NotesArray.length);

    // get the desired random note from the relative 17notes array
    rootNote = NotesArray[randomIndex];
    return rootNote;
}

//generates a new string after considering the checkboxes value
function generateRandomString(selectedStrings){
    const stringsArray = [" 3rd String "," 4th String "," 5th String "," 6th String "]; //all the 4 possible strings
    var i=0;
    
    if(selectedStrings.length==0) {alert("no string selected :c")};

    var stringSelection=[];
     while(i<selectedStrings.length){
        stringSelection.push(stringsArray[selectedStrings[i]]);
        i++;
    }
    
    const randomIndex = Math.floor(Math.random()*stringSelection.length); //choosing one random String among the four
    currentStringNumber=3+parseInt(selectedStrings[randomIndex]);
    return stringSelection[randomIndex];
}

//returns available notes in a given string after consideringthe checkboxes values for the selected notes
function getAvailableNotesFromString(stringNumber,selectedNotes){
    var i=0;
    var NoteSelection = [];
    
    while(i<selectedNotes.length){
        NoteSelection.push(twelveNotesString[stringNumber-1][selectedNotes[i]]);
        i++;
    }
    return NoteSelection;
}










//AUDIO SECTION


//function that set us into practice mode
function practiceMode(){
    var skipMetronome=!mode;
    mode=1;
    document.getElementById("practiceReproductionIcon").style.visibility="visible";
    document.getElementById("playIcon").style.visibility="visible";
    document.getElementById("stopIcon").style.visibility="hidden";
    
    document.getElementById("triadGeneratorRectangle").style.display="none";
    document.getElementById("triadGeneratorRectangle2").style.display="inline-block";
return;
}

//function that coordinates the timing of the practiceMode notes, chords and metronome beats
var isPlayingPractice=0;
async function generateSoundPractice(){
    if((mode!=1)||(rootNote=="noRootGenerated"))return;
    
    
    
    if(isPlayingPractice==0){
        isPlayingPractice=1;
        document.getElementById("playIcon").style.visibility="hidden";
        document.getElementById("stopIcon").style.visibility="visible";}
        
        
    else {isPlayingPractice=0;
        document.getElementById("playIcon").style.visibility="visible";
        document.getElementById("stopIcon").style.visibility="hidden";
    };



    var midiNoteToBePlayed=[[]];
    switch(currentTriad){
        case 0: 
                midiNoteToBePlayed[0]=generateMajTriad(0);
                midiNoteToBePlayed[1]=generateMajTriad(1);
                midiNoteToBePlayed[2]=generateMajTriad(2);
        break;
        case 1:
                midiNoteToBePlayed[0]=generateMinTriad(0);
                midiNoteToBePlayed[1]=generateMinTriad(1);
                midiNoteToBePlayed[2]=generateMinTriad(2);
        break;
        case 2:
                midiNoteToBePlayed[0]=generateAugTriad(0);
                midiNoteToBePlayed[1]=generateAugTriad(1);
                midiNoteToBePlayed[2]=generateAugTriad(2);
        break;
        case 3: 
                midiNoteToBePlayed[0]=generateDimTriad(0);
                midiNoteToBePlayed[1]=generateDimTriad(1);
                midiNoteToBePlayed[2]=generateDimTriad(2);
        break;
        default:
        alert("Couldn't find the triad :c");
        
    }

    //REPRODUCING THE SOUND!
    //sorting in the right order
    var SortedfirstNotes=[midiNoteToBePlayed[0][0],midiNoteToBePlayed[1][0],midiNoteToBePlayed[2][0]].sort(function(a, b){return a - b});

  
    var i=0;
    //IDENTIFYING THE LOWEST CHORD TONE INSIDE THE STRING
    if( SortedfirstNotes[0]==midiNoteToBePlayed[0][0]){i=0;}
    if( SortedfirstNotes[0]==midiNoteToBePlayed[1][0]){i=1;}
    if( SortedfirstNotes[0]==midiNoteToBePlayed[2][0]){i=2;}
    
    //4 metronome ticks
    beatCount=0;
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //4 metronome ticks    
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //3 individual notes and a tick
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][0]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][1]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //a chord and 3 ticks
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyTriad(midiNoteToBePlayed[i][0],midiNoteToBePlayed[i][1],midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //IDENTIFYING THE SECOND LOWEST CHORD TONE INSIDE THE STRING
    if( SortedfirstNotes[1]==midiNoteToBePlayed[0][0]){i=0;}
    if( SortedfirstNotes[1]==midiNoteToBePlayed[1][0]){i=1;}
    if( SortedfirstNotes[1]==midiNoteToBePlayed[2][0]){i=2;}
    
    //3 individual notes and a tick
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][0]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][1]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //a chord and 3 ticks
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyTriad(midiNoteToBePlayed[i][0],midiNoteToBePlayed[i][1],midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);


    //IDENTIFYING THE HIGHEST CHORD TONE INSIDE THE STRING
    if( SortedfirstNotes[2]==midiNoteToBePlayed[0][0]){i=0;}
    if( SortedfirstNotes[2]==midiNoteToBePlayed[1][0]){i=1;}
    if( SortedfirstNotes[2]==midiNoteToBePlayed[2][0]){i=2;}
    
    //3 individual notes and a tick
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][0]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][1]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //a chord and 3 ticks
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyTriad(midiNoteToBePlayed[i][0],midiNoteToBePlayed[i][1],midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if(mode==0||isPlayingPractice==0) {isPlayingPractice=0; return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    
    isPlayingPractice=0;
    
    document.getElementById("playIcon").style.visibility="visible";
    document.getElementById("stopIcon").style.visibility="hidden";
    return;
}

//function used in play-along mode that generates a new triad every time one has done being played
var isPlayingPlayAlong=false;
async function playAlongMode(){
    mode=0;
    if(isPlayingPlayAlong)return;

    document.getElementById("practiceReproductionIcon").style.visibility="hidden";
    document.getElementById("stopIcon").style.visibility="hidden";
    document.getElementById("playIcon").style.visibility="hidden";
    document.getElementById("triadGeneratorRectangle").style.display="inline-block";
    document.getElementById("triadGeneratorRectangle2").style.display="none";
    if(playAlongDisabled==1){document.getElementById("triadGeneratorRectangle").textContent="START!";}
    if(playAlongDisabled==0){document.getElementById("triadGeneratorRectangle").textContent="STOP!";}

    while((playAlongDisabled==0)&&(mode==0)){
        isPlayingPlayAlong=true;
        displayNewTriad();
        await generateSoundPlayAlong();
    }
    isPlayingPlayAlong=false;
    return;
}

//function that coordinates the timing of the playAlongMode notes, chords and metronome beats
async function generateSoundPlayAlong(){
    var midiNoteToBePlayed=[[]];
    switch(currentTriad){
        case 0: 
                midiNoteToBePlayed[0]=generateMajTriad(0);
                midiNoteToBePlayed[1]=generateMajTriad(1);
                midiNoteToBePlayed[2]=generateMajTriad(2);
        break;
        case 1:
                midiNoteToBePlayed[0]=generateMinTriad(0);
                midiNoteToBePlayed[1]=generateMinTriad(1);
                midiNoteToBePlayed[2]=generateMinTriad(2);
        break;
        case 2:
                midiNoteToBePlayed[0]=generateAugTriad(0);
                midiNoteToBePlayed[1]=generateAugTriad(1);
                midiNoteToBePlayed[2]=generateAugTriad(2);
        break;
        case 3: 
                midiNoteToBePlayed[0]=generateDimTriad(0);
                midiNoteToBePlayed[1]=generateDimTriad(1);
                midiNoteToBePlayed[2]=generateDimTriad(2);
        break;
        default:
        alert("Couldn't find the triad :c");
    }

    //REPRODUCING THE SOUND!
    //sorting in the right order
    var SortedfirstNotes=[midiNoteToBePlayed[0][0],midiNoteToBePlayed[1][0],midiNoteToBePlayed[2][0]].sort(function(a, b){return a - b});

  
    var i=0;
    //IDENTIFYING THE LOWEST CHORD TONE INSIDE THE STRING
    if( SortedfirstNotes[0]==midiNoteToBePlayed[0][0]){i=0;}
    if( SortedfirstNotes[0]==midiNoteToBePlayed[1][0]){i=1;}
    if( SortedfirstNotes[0]==midiNoteToBePlayed[2][0]){i=2;}
    
    //4 ticks
    beatCount=0;
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //4 ticks
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //3 individual notes and a tick
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][0]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][1]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //a chord and 3 ticks
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyTriad(midiNoteToBePlayed[i][0],midiNoteToBePlayed[i][1],midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //IDENTIFYING THE SECOND LOWEST CHORD TONE INSIDE THE STRING
    if( SortedfirstNotes[1]==midiNoteToBePlayed[0][0]){i=0;}
    if( SortedfirstNotes[1]==midiNoteToBePlayed[1][0]){i=1;}
    if( SortedfirstNotes[1]==midiNoteToBePlayed[2][0]){i=2;}

    //3 individual notes and a tick
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][0]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][1]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //a chord and 3 ticks
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyTriad(midiNoteToBePlayed[i][0],midiNoteToBePlayed[i][1],midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);


    //IDENTIFYING THE HIGHEST CHORD TONE INSIDE THE STRING
    if( SortedfirstNotes[2]==midiNoteToBePlayed[0][0]){i=0;}
    if( SortedfirstNotes[2]==midiNoteToBePlayed[1][0]){i=1;}
    if( SortedfirstNotes[2]==midiNoteToBePlayed[2][0]){i=2;}
    
    //3 individual notes and a tick
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][0]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][1]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyNote(midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);

    //a chord and 3 ticks
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    playMyTriad(midiNoteToBePlayed[i][0],midiNoteToBePlayed[i][1],midiNoteToBePlayed[i][2]);
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    if((playAlongDisabled==1)||(mode==1)){return;}
    milliseconds=1000*60/document.getElementById("myRange").value;
    metronome();
    await sleep(milliseconds);
    
    return;
}

//metronome tick reproduction
async function metronome(){
    if(!metronomeDisabled){beat[beatCount].play();}
    beatCount=beatCount+1;
    if (beatCount==8){beatCount=beatCount-8};
    
    return;
}

//function developed to manage the time interval between the reproduction of notes.
function sleep(ms) {
    return new Promise(val => setTimeout(val, ms));
}







//TRIAD GENERATION


//The argument is the type of inversion
function generateMinTriad(inversion){
    //Defining the midi values of the triad for every inversion
    var firstmidi =  Tone.Frequency(rootNote).toMidi();
    var secondmidi = firstmidi+3;
    var thirdmidi =  secondmidi+4;
    //Adjusting desired pitch
    if (inversion==0){
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(thirdmidi, "midi").toNote()))){
            firstmidi = firstmidi+12;
            secondmidi = secondmidi+12;
            thirdmidi = thirdmidi+12;
        }
    
    }
    if(inversion==1){
        //Inverting the triad;
        firstmidi=firstmidi+12;
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(firstmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }

    }
    if(inversion==2){
        //Inverting the triad
        firstmidi=firstmidi+12;
        secondmidi=secondmidi+12;

        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(secondmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }
    }

    //returning the desired triad
    if(inversion==0) return([firstmidi,secondmidi,thirdmidi]);
    if(inversion==1) return([secondmidi,thirdmidi,firstmidi]);
    if(inversion==2) return([thirdmidi,firstmidi,secondmidi]);
    
    return;
}


function generateMajTriad(inversion){
    //Defining the notes of the triad for every inversion, Notes are for example "E4","C5","G#2"
    var firstmidi =  Tone.Frequency(rootNote).toMidi();
    var secondmidi = firstmidi+4;
    var thirdmidi =  secondmidi+3;

    //Adjusting desired pitch
    if (inversion==0){
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(thirdmidi, "midi").toNote()))){
            firstmidi = firstmidi+12;
            secondmidi = secondmidi+12;
            thirdmidi = thirdmidi+12;
        }
    
    }
    if(inversion==1){
        //Inverting the triad;
        firstmidi=firstmidi+12;
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(firstmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }

    }
    if(inversion==2){
        //Inverting the triad
        firstmidi=firstmidi+12;
        secondmidi=secondmidi+12;

        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(secondmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }
    }

    //returning the desired triad
    if(inversion==0) return([firstmidi,secondmidi,thirdmidi]);
    if(inversion==1) return([secondmidi,thirdmidi,firstmidi]);
    if(inversion==2) return([thirdmidi,firstmidi,secondmidi]);
    
    return;
}


function generateAugTriad(inversion){
    //Defining the notes of the triad for every inversion, Notes are for example "E4","C5","G#2"
    var firstmidi =  Tone.Frequency(rootNote).toMidi();
    var secondmidi = firstmidi+4;
    var thirdmidi =  secondmidi+4;

    //Adjusting desired pitch
    if (inversion==0){
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(thirdmidi, "midi").toNote()))){
            firstmidi = firstmidi+12;
            secondmidi = secondmidi+12;
            thirdmidi = thirdmidi+12;
        }
    
    }
    if(inversion==1){
        //Inverting the triad;
        firstmidi=firstmidi+12;
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(firstmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }

    }
    if(inversion==2){
        //Inverting the triad
        firstmidi=firstmidi+12;
        secondmidi=secondmidi+12;

        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(secondmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }
    }

    //returning the desired triad
    if(inversion==0) return([firstmidi,secondmidi,thirdmidi]);
    if(inversion==1) return([secondmidi,thirdmidi,firstmidi]);
    if(inversion==2) return([thirdmidi,firstmidi,secondmidi]);
    
    return;
}


function generateDimTriad(inversion){
    //Defining the notes of the triad for every inversion, Notes are for example "E4","C5","G#2"
    var firstmidi =  Tone.Frequency(rootNote).toMidi();
    var secondmidi = firstmidi+3;
    var thirdmidi =  secondmidi+3;

    //Adjusting desired pitch
    if (inversion==0){
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(thirdmidi, "midi").toNote()))){
            firstmidi = firstmidi+12;
            secondmidi = secondmidi+12;
            thirdmidi = thirdmidi+12;
        }
    
    }
    if(inversion==1){
        //Inverting the triad;
        firstmidi=firstmidi+12;
        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(firstmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }

    }
    if(inversion==2){
        //Inverting the triad
        firstmidi=firstmidi+12;
        secondmidi=secondmidi+12;

        //neck transposition Mod12 when the triad is not playable on the first frets
        if (!(twelveNotesString[-1+currentStringNumber-2].includes(Tone.Frequency(secondmidi, "midi").toNote()))){
            firstmidi = firstmidi-12;
            secondmidi = secondmidi-12;
            thirdmidi = thirdmidi-12;
        }
    }

    //returning the desired triad
    if(inversion==0) return([firstmidi,secondmidi,thirdmidi]);
    if(inversion==1) return([secondmidi,thirdmidi,firstmidi]);
    if(inversion==2) return([thirdmidi,firstmidi,secondmidi]);
    
    return;
}





//NOTE REPRODUCTION

function playMyNote(firstmidi){ //plays one note
    if(!triadsplayAlongDisabled){
        Tone.start();
        const firstNote=Tone.Frequency(firstmidi, "midi");//get frequency from midi

        const now = Tone.now()+0.008;   //adding a 8 ms delay because the metronome sample "clicks" after this amount of time

        //Play the note
        playSound.triggerAttackRelease(firstNote, "8n", now);
    }
    
    return;
}

function playMyTriad(firstmidi,secondmidi,thirdmidi){ //plays three notes concurrently


    if(!triadsplayAlongDisabled){
    Tone.start();
    const firstNote=Tone.Frequency(firstmidi, "midi");//get the frequencies from midi
    const SecondNote=Tone.Frequency(secondmidi, "midi");
    const ThirdNote=Tone.Frequency(thirdmidi, "midi");

    const now = Tone.now()+0.008;   //adding a 8 ms delay because the metronome sample "clicks" after this amount of time
    
    //Play the three notes together
    playSound.triggerAttack(firstNote, now );
    playSound.triggerAttack(SecondNote, now);
    playSound.triggerAttack(ThirdNote, now);
    playSound.triggerRelease([firstNote, SecondNote, ThirdNote], now + milliseconds*1.5/1000);
    }
    return;
}






//INTERACTIVE BUTTONS/ELEMENTS

function refreshSliderBox() { //refreshes the current slider value
    var currentBpm=document.getElementById("myRange").value;
    document.getElementById("bpmNumber").innerHTML ="BPM: "+ currentBpm;
    return;
}

function muteMetronome() { //mute metronome button implementation
    if(metronomeDisabled==0){
        metronomeDisabled=1;
        document.getElementById("metronome1").style.visibility="hidden";
        document.getElementById("metronome2").style.visibility="visible";
    }
    else {metronomeDisabled=0;
        document.getElementById("metronome1").style.visibility="visible";
        document.getElementById("metronome2").style.visibility="hidden";
    };
    return;
}

function muteAudioTriads() {  //mute audio button implementation
    if(triadsplayAlongDisabled==0){
        triadsplayAlongDisabled=1;
        document.getElementById("audioIcon1").style.visibility="hidden";
        document.getElementById("audioIcon2").style.visibility="visible";
    }
    else {triadsplayAlongDisabled=0;
        document.getElementById("audioIcon1").style.visibility="visible";
        document.getElementById("audioIcon2").style.visibility="hidden";
    };
    return;
}

function pauseplayAlong(){ //pause Play-Along mode
    
    if(playAlongDisabled==0){
        document.getElementById("triadGeneratorRectangle").textContent="START!";
        playAlongDisabled=1;
    }
    else {
        document.getElementById("triadGeneratorRectangle").textContent="STOP!";
        playAlongDisabled=0;
        playAlongMode();
    };

    return;
}

function toggleFretboard() {
    const fretboard = document.querySelector('.fretboard');
    const btnIcons = document.querySelectorAll('.btnIcon');
  
    fretboard.classList.toggle('fretboardVisible');
  
    if (fretboard.classList.contains('fretboardVisible')) {
      let leftPosition = 83; // Adjust the initial left position
      btnIcons.forEach((btnIcon) => {
        document.getElementById("guitarIcon1").style.visibility="hidden";
        document.getElementById("guitarIcon2").style.visibility="visible";
        btnIcon.style.position = 'fixed';
        btnIcon.style.bottom = '255px';
        btnIcon.style.left = `${leftPosition}vw`;
        leftPosition += 4; // Adjust the spacing between buttons 
      });
    } else {
      btnIcons.forEach((btnIcon) => {
        btnIcon.style.position = 'relative';
        btnIcon.style.left = '';
        document.getElementById("guitarIcon1").style.visibility="visible";
        document.getElementById("guitarIcon2").style.visibility="hidden";

      });

   // Adjust the position of specific buttons when fretboard is hidden
    document.getElementById("metronomeIcon").style.position = 'fixed';
    document.getElementById("metronomeIcon").style.bottom = '0vh';
    document.getElementById("metronomeIcon").style.left = '83vw';

    document.getElementById("muteAudioIcon").style.position = 'fixed';
    document.getElementById("muteAudioIcon").style.bottom = '0vh';
    document.getElementById("muteAudioIcon").style.left = '87vw';

    document.getElementById("toggleFretboardIcon").style.position = 'fixed';
    document.getElementById("toggleFretboardIcon").style.bottom = '0vh';
    document.getElementById("toggleFretboardIcon").style.left = '91vw';


    document.getElementById("practiceReproductionIcon").style.position = 'fixed';
    document.getElementById("practiceReproductionIcon").style.bottom = '0vh';
    document.getElementById("practiceReproductionIcon").style.left = '95vw';
    }
}
  
  



//GUITAR FRETBOARD GENERATION

function plotFretboard() {
    const root = document.documentElement;
    const fretboard = document.querySelector('.fretboard');
    const singleFretMarkPositions = [3, 5, 7, 9, 15, 17];
    const doubleFretMarkPositions = [12, 24];
    const values = ['1st', '3rd', '5th'];
    let numberOfFrets = 15;
    let numberOfStrings = 6;
  
    const app = {
      init() {
        this.setupFretboard();
      },
      setupFretboard() {
        fretboard.innerHTML = '';
        //add strings to fretboard
        for (let i = 0; i < numberOfStrings; i++) {
          let string = tools.createElement('div');
          string.classList.add('string');
          fretboard.appendChild(string);
  
          //create frets
          for (let fret = 0; fret <= numberOfFrets; fret++) {
            let noteFret = tools.createElement('div');
            noteFret.classList.add('noteFret');
            string.appendChild(noteFret);
  
            //add single fret marks
            if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
              noteFret.classList.add('singleFretmark');
            }

            //add double fret mark
            if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
              let doubleFretMark = tools.createElement('div');
              doubleFretMark.classList.add('doubleFretmark');
              noteFret.appendChild(doubleFretMark);
            }
          }
        }
      },

      //function that plots the dots with the note degrees text
      addDot(stringIndex, fretIndex, values) {
        const stringElements = document.querySelectorAll('.string');
        const selectedString = stringElements[stringIndex];
        const noteFrets = selectedString.querySelectorAll('.noteFret');
        const selectedNoteFret = noteFrets[fretIndex];
        
        const dot = tools.createElement('div');
        dot.classList.add('dot');


        //text
        values.forEach(value => {
            const dotText = tools.createElement('span');
            dotText.classList.add('dotText');
            dotText.textContent = value;
            dot.appendChild(dotText);
          });



        selectedNoteFret.appendChild(dot);
      }
    };
  
    //function that interfaces JS with HTML
    const tools = {
      createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
          element.innerHTML = content;
        }
        return element;
      }
    };
  
    app.init();
  
    //augmented triads positions
    const chords = [
      { name: '0', positions: [[0, 1], [1, 2], [2, 2], [3, 3], [4, 4], [5, 5]] }, 
      { name: '1', positions: [[0, 5], [1, 6], [2, 6], [3, 7], [4, 8], [5, 9]] },
      { name: '2', positions: [[0, 9], [1, 10], [2, 10], [3, 11], [4, 12], [5, 13]] }
    ];
    
  
 

    function handleChordSelection() {
        const dotElements = document.querySelectorAll('.noteFret .dot');
        /*const noteDegrees=[[]];
        noteDegrees[0]=[0,1,2,0,1,2];
        noteDegrees[1]=[1,2,0,1,2,0];
        noteDegrees[2]=[2,0,1,2,0,1];*/
        var positionfifth=[[]];
        var positionthird=[[]];
        var positionfirst=[[]];
        for(var i=0;i<3;i++){

            positionfirst[(i+1)%3]=[0+i,3+i];
            positionthird[(i+2)%3]=[0+i,3+i];
            positionfifth[i]=[0+i,3+i];
            };
        //remove all dots
        dotElements.forEach(dot => {
            dot.remove();
        });
  
        //show dot for the selected chord and string
        for(var j=0;j<3;j++){
            var chord = (chords.find(chord => chord.name === (j.toString())));
            var note_position=[[]];
            
            var thirdToShift=positionthird[j];
            var fifthToShift=positionfifth[j];
            var stringToPrint=[];
            var fretToPrint=[];
            var noteDegreeToPrint=[];

            switch (currentTriad) {
                case 0:
                    
                    ////////MAJOR
                    for(var i=0; i<3; i++){
                        note_position [i]= chord.positions.find(pos => pos[0] === parseInt(currentStringNumber-1-i));
                        
                        if (note_position[i]){
                            var stringIndex = note_position[i][0];
                            var fretIndex = note_position[i][1];
                            
                            if(fifthToShift.includes(stringIndex)){
                                fretIndex=fretIndex-1;
                                var dotValues = [values[2]];//the note is a fifth?
                            }
                            else if(thirdToShift.includes(stringIndex)){
                                var dotValues = [values[1]];//the note is a third?
                            }
                            else{
                                var dotValues = [values[0]];//the note is a rootnote?
                            };
                            
                        //get the value at the corresponding index
                        stringToPrint[i]=stringIndex;
                        fretToPrint[i]=fretIndex+(Tone.Frequency(rootNote).toMidi()+3)%12;    
                        noteDegreeToPrint[i]=dotValues;
                        }
                        
                    }
                    if(fretToPrint[0]>=12&&fretToPrint[1]>=12&&fretToPrint[2]>=12){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]-12;
                        fretToPrint[1]=fretToPrint[1]-12;
                        fretToPrint[2]=fretToPrint[2]-12;
                    }
                    if(fretToPrint[0]<0||fretToPrint[1]<0||fretToPrint[2]<0){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]+12;
                        fretToPrint[1]=fretToPrint[1]+12;
                        fretToPrint[2]=fretToPrint[2]+12;
                    }
                    app.addDot(stringToPrint[0],fretToPrint[0],noteDegreeToPrint[0]);
                    app.addDot(stringToPrint[1],fretToPrint[1],noteDegreeToPrint[1]);
                    app.addDot(stringToPrint[2],fretToPrint[2],noteDegreeToPrint[2]);
                break;
                case 1:
                    ////////MINOR
                    for(var i=0; i<3; i++){
                        note_position [i]= chord.positions.find(pos => pos[0] === (currentStringNumber-1-i));
                        if (note_position[i]){
                            
                            const stringIndex = note_position[i][0];
                            var fretIndex = note_position[i][1];
                            
                            if(thirdToShift.includes(stringIndex)){fretIndex=fretIndex-1; var dotValues = [values[1]];}
                            else if(fifthToShift.includes(stringIndex)){fretIndex=fretIndex-1; var dotValues = [values[2]];}
                            else {var dotValues = [values[0]];}
                            
                            stringToPrint[i]=stringIndex;
                            fretToPrint[i]=fretIndex+(Tone.Frequency(rootNote).toMidi()+3)%12;   
                            noteDegreeToPrint[i]=dotValues;
                        }
                    }
                    if(fretToPrint[0]>=12&&fretToPrint[1]>=12&&fretToPrint[2]>=12){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]-12;
                        fretToPrint[1]=fretToPrint[1]-12;
                        fretToPrint[2]=fretToPrint[2]-12;
                    }
                    if(fretToPrint[0]<0||fretToPrint[1]<0||fretToPrint[2]<0){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]+12;
                        fretToPrint[1]=fretToPrint[1]+12;
                        fretToPrint[2]=fretToPrint[2]+12;
                    }
                    app.addDot(stringToPrint[0],fretToPrint[0],noteDegreeToPrint[0]);
                    app.addDot(stringToPrint[1],fretToPrint[1],noteDegreeToPrint[1]);
                    app.addDot(stringToPrint[2],fretToPrint[2],noteDegreeToPrint[2]);

                    
                break;
                case 2:
        
                    ////////AUGMENTED
                    for(var i=0; i<3; i++){
                        note_position [i]= chord.positions.find(pos => pos[0] === (currentStringNumber-1-i));
                        if (note_position[i]){

                            const stringIndex = note_position[i][0];
                            const fretIndex = note_position[i][1];


                            if(fifthToShift.includes(stringIndex)){
                                var dotValues = [values[2]];
                            }

                            else if(thirdToShift.includes(stringIndex)){
                                var dotValues = [values[1]];
                            }
                            else{
                                var dotValues = [values[0]];
                            };
                            stringToPrint[i]=stringIndex;
                            fretToPrint[i]=fretIndex+(Tone.Frequency(rootNote).toMidi()+3)%12;   
                            noteDegreeToPrint[i]=dotValues;
                        }   


                    }
                    if(fretToPrint[0]>=12&&fretToPrint[1]>=12&&fretToPrint[2]>=12){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]-12;
                        fretToPrint[1]=fretToPrint[1]-12;
                        fretToPrint[2]=fretToPrint[2]-12;
                    }
                    if(fretToPrint[0]<0||fretToPrint[1]<0||fretToPrint[2]<0){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]+12;
                        fretToPrint[1]=fretToPrint[1]+12;
                        fretToPrint[2]=fretToPrint[2]+12;
                    }
                    app.addDot(stringToPrint[0],fretToPrint[0],noteDegreeToPrint[0]);
                    app.addDot(stringToPrint[1],fretToPrint[1],noteDegreeToPrint[1]);
                    app.addDot(stringToPrint[2],fretToPrint[2],noteDegreeToPrint[2]);
                    
                break;
                case 3:   
                    ////////DIMINISHED
                    for(var i=0; i<3; i++){
                        note_position [i]= chord.positions.find(pos => pos[0] === (currentStringNumber-1-i));
                        if (note_position[i]){
                            
                            const stringIndex = note_position[i][0];
                            var fretIndex = note_position[i][1];
                            
                            if(thirdToShift.includes(stringIndex)){fretIndex=fretIndex-1; var dotValues = [values[1]]}
                            else if(fifthToShift.includes(stringIndex)){fretIndex=fretIndex-2; var dotValues = [values[2]]}
                            else{var dotValues = [values[0]]};
                        
                            stringToPrint[i]=stringIndex;
                            fretToPrint[i]=fretIndex+(Tone.Frequency(rootNote).toMidi()+3)%12;
                            noteDegreeToPrint[i]=dotValues;
                        }


                        
                    }
                    if(fretToPrint[0]>=12&&fretToPrint[1]>=12&&fretToPrint[2]>=12){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]-12;
                        fretToPrint[1]=fretToPrint[1]-12;
                        fretToPrint[2]=fretToPrint[2]-12;
                    }
                    if(fretToPrint[0]<0||fretToPrint[1]<0||fretToPrint[2]<0){ //if every note dot is above fret 11 transpose them at the beginning of the neck
                        fretToPrint[0]=fretToPrint[0]+12;
                        fretToPrint[1]=fretToPrint[1]+12;
                        fretToPrint[2]=fretToPrint[2]+12;
                    }
                    app.addDot(stringToPrint[0],fretToPrint[0],noteDegreeToPrint[0]);
                    app.addDot(stringToPrint[1],fretToPrint[1],noteDegreeToPrint[1]);
                    app.addDot(stringToPrint[2],fretToPrint[2],noteDegreeToPrint[2]);
                    
                break;
                default:
                alert("no triad type selected");
                    
            }
                    
        }    
        
    }
  
    //initialize the fretboard with the selected triad
    handleChordSelection();
};



