//Created By: Hiren Patel on 22-Mar-15

var SudokoGame = function () {

    var self = this;
    var cGridName = "tblGrid";
    var cStorageKey = "sudokoJson";

    this.getRandomJsonFromServer = function () {
        //Here code to get random json from server
        return "[1,0,0,0,2,0,7,9,0,0,9,5,7,4,3,2,8,1,8,7,2,1,5,9,3,4,6,4,0,9,5,3,6,1,2,0,7,5,6,8,1,2,9,3,4,3,2,1,9,7,4,6,5,8,2,6,7,4,9,5,8,1,3,5,1,3,2,8,7,4,6,9,0,4,0,0,6,1,5,7,2]";
    };

    //Start new game
    this.startGame = function () {
        self.fillInitialGrid();
        self.playGame();
    };

    //Start from previouslt saved game.
    this.startFromSavedGame = function () {
        self.fillInitialGrid();

        var cJson = localStorage[cStorageKey];

        self.fillGridWithOutEditable(JSON.parse(cJson))
        self.playGame();
    };

    //Start playing game
    this.playGame = function () {
        $("#btnStartGame,#btnLoadFromSaved").prop("disabled", true);
        $("#btnSaveGame,#btnValidateGame").prop("disabled", false);

        self.handleGridInput();
    };

    //Fill initial grid
    this.fillInitialGrid = function () {
        var cJson = self.getRandomJsonFromServer();
        var oJson = JSON.parse(cJson);

        var iCurItem = 0;
        var oGrid = document.getElementById("tblGrid");

        for (var i = 0, row = 0, col = 0; i < oJson.length; i++) {

            iCurItem = oJson[i];
            if (iCurItem != 0) {
                oGrid.rows[row].cells[col].innerHTML = iCurItem;
            }
            else {
                $(oGrid.rows[row].cells[col]).addClass("editable");
            }

            col++;
            if (col == 9) { col = 0; row++; }
        }

    };

    //Fill grid without Editable
    this.fillGridWithOutEditable = function (oJson) {

        var iCurItem = 0;
        var oGrid = document.getElementById("tblGrid");

        for (var i = 0, row = 0, col = 0; i < oJson.length; i++) {

            iCurItem = oJson[i];
            if (iCurItem != 0) {
                oGrid.rows[row].cells[col].innerHTML = iCurItem;
            }

            col++;
            if (col == 9) { col = 0; row++; }
        }

    }

    this.handleGridInput = function () {
        $(".editable").each(function () {
            var curCell = $(this);
            curCell.click(function () {

                var oRetVal = prompt("Please Enter Value", curCell.html());
                if (self.validateCellEnterValue(oRetVal)) {
                    curCell.html(oRetVal);
                }

            });

        });

    };

    //(Only validate for numeric and between 1 to 9) or ''
    this.validateCellEnterValue = function (oValue) {
        var oParsedVal = parseInt(oValue);

        return (oValue.length == 1 && (oValue == '' || oParsedVal < 10));
    };

    this.handleValidateGrid = function () {
        if (self.validateGrid()) {
            alert("Bingo! \n\n You Have Completed Sudoko.");
            self.clearGame();
        }
        else {
            alert("Something is not correct.\n\n Please try again to fix the game.");
        }
    };

    //Validates Suduko grid
    this.validateGrid = function () {
        var oGrid = document.getElementById("tblGrid");
        var cCurItem = '';
        var oArray = [];

        //Validate each row
        for (var i = 0; i < 9; i++) {
            oArray = [];

            for (j = 0; j < 9; j++) {
                cCurItem = oGrid.rows[i].cells[j].innerHTML;
                if (cCurItem == '') { return false; }
                oArray.push(parseInt(cCurItem));
            }

            if (!self.validateUniqueness(oArray)) { return false; }
        }

        //Validate each column
        for (var i = 0; i < 9; i++) {
            oArray = [];

            for (j = 0; j < 9; j++) {
                cCurItem = oGrid.rows[j].cells[i].innerHTML;
                if (cCurItem == '') { return false; }
                oArray.push(parseInt(cCurItem));
            }

            if (!self.validateUniqueness(oArray)) { return false; }
        }

        //Validate each box
        for (var i = 1; i < 10; i++) {
            oArray = [];
            var oGridCells = document.getElementsByClassName("g" + i);
            for (var oCell in oGridCells) {
                cCurItem = $(oCell).html();
                if (cCurItem == '') { return false; }
                oArray.push(parseInt(cCurItem));
            }

            if (!self.validateUniqueness(oArray)) { return false; }
        }

        return true;
    };

    //Validates uniqueness of an array
    this.validateUniqueness = function (oArray) {

        var sorted_arr = oArray.sort();

        var results = [];
        for (var i = 0; i < oArray.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }

        return results.length == 0;
    };

    //Save Game
    this.saveGame = function () {
        var oGrid = document.getElementById("tblGrid");
        var cCurItem = '';
        var oArray = [];

        for (var i = 0; i < 9; i++) {

            for (j = 0; j < 9; j++) {
                cCurItem = oGrid.rows[i].cells[j].innerHTML;

                if (cCurItem == '') { oArray.push(0); }
                else { oArray.push(parseInt(cCurItem)); }
            }

        }

        localStorage.setItem(cStorageKey, JSON.stringify(oArray));
        alert("You have successfully Saved game.\n\n You can start game at this state anytime by pressing 'Start From Previous Saved Game' button.");
    };

    //Clear all
    this.clearGame = function () {

        delete localStorage[cStorageKey];

        $("#btnStartGame,#btnLoadFromSaved").prop("disabled", false);
        $("#btnSaveGame,#btnValidateGame").prop("disabled", true);

        var oGrid = document.getElementById("tblGrid");
        var oCurItem = '';

        for (var i = 0; i < 9; i++) {

            for (j = 0; j < 9; j++) {
                oCurItem = $(oGrid.rows[i].cells[j]);
                oCurItem.removeClass("editable").html("");
            }

        }

    };

};


$(document).ready(function () {
    var oGame = new SudokoGame();

    $("#btnStartGame").click(function () {
        oGame.startGame();
    });

    $("#btnLoadFromSaved").click(function () {
        if (localStorage["sudokoJson"]) {
            oGame.startFromSavedGame();
        }
        else {
            alert("You don't have any previously saved game.");
        }
    });
    $("#btnSaveGame").click(oGame.saveGame);
    $("#btnValidateGame").click(oGame.handleValidateGrid);

});