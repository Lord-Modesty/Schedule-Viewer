//Wird getriggert, wenn die Seite geladen wird
$(document).ready(pageLoad);

function pageLoad() {

    //Wenn die Seite geladen wird, werden die folgenden Elemente versteckt
    $("#textinfo-class").hide();
    $("#class").hide();
    $("#schedule-grid").hide();

    //Holt die Berufe via Ajax
    $.ajax({
        url: 'http://home.gibm.ch/interfaces/133/berufe.php',
        dataType: 'json',
        success: function (data) {
            // Füllt die Daten in das Dropdown der Berufe ein
            $.each(data, function (i, value) { 
                $('#profession').append('<option value="' + value.beruf_id + '">' + value.beruf_name + '</option>');
            });
        }
    });
}

//Wird getriggert, wenn ein Beruf ausgewählt wird
$(document).ready(berufeManager);

function berufeManager() {
    $('#profession').change(function () {
       
        if ($('#profession').val() != '-') {  //Überprüft, ob ein Beruf ausgewählt ist
            
            FadeIn('#textinfo-class');
            FadeIn('#class');

            //Holt die Klassen via Ajax
            $.ajax({
                url: 'http://home.gibm.ch/interfaces/133/klassen.php',
                data: {
                    'beruf_id': $('#profession').val() //Parameter des ausgewählten Berufes
                },
                dataType: 'json',
                success: function (data) {
                    if ($('#profession').val() != '-')
                    {
                        $('#class option[value !="-"]').remove(); //Entfernt die vorhandenen Klassen

                        //Füllt die Daten in das Dropdown Klasse ein
                        $.each(data, function (i, value) {
                            $('#class').append('<option value="' + value.klasse_id + '">' + value.klasse_name + '</option>');
                        });
                    }
                }
            });
            
            FadeOut('#schedule-grid');
            $('#schedule-grid tbody').empty();
        
        } else {
        
            FadeOut('#textinfo-class');
            FadeOut('#class');
            $('#class option[value !="-"]').remove();
            FadeOut('#schedule-grid');
            $('#schedule-grid tbody').empty();
        
        }
    });
};

//Wird getriggert, wenn eine Klasse ausgewählt wird
$(document).ready(klasseManager);

function klasseManager() {
    
    $('#class').change(function () { 
        if ($('#class').val() != '-') { //Überprüft, ob eine Klasse ausgewählt ist
            
            FadeOut('#schedule-grid');
            //Holt die Daten via Ajax
            $.ajax({
                url: 'http://home.gibm.ch/interfaces/133/tafel.php',
                data: {
                    'klasse_id': $('#class').val() //Parameter der ausgewählten Klasse
                },
                dataType: 'json',
                success: function (data) {
                  
                        $('#schedule-grid tbody').empty(); //Entfernt den vorhandenen Stundenplan
                        
                        //Füllt die Daten in das Stundeplan-grid ein
                        if (data && data.length) {
                            $.each(data, function (i, value) {
                                var tr = $('<tr></tr>').appendTo($('#schedule-grid tbody'));
                                $('<td>' + value.tafel_von + ' - ' + value.tafel_bis + '</td>').appendTo(tr);
                                $('<td>' + value.tafel_datum + '</td>').appendTo(tr);
                                $('<td>' + value.tafel_longfach + '</td>').appendTo(tr);
                                $('<td>' + value.tafel_lehrer + '</td>').appendTo(tr);
                                $('<td>' + value.tafel_raum + '</td>').appendTo(tr);
                                $('<td>' + value.tafel_kommentar + '</td>').appendTo(tr);

                            });

                            FadeIn('#schedule-grid');

                        } else 
                        {
                            FadeOut('#schedule-grid');
                            
                            //Es sind keine Stundenpläne vorhanden
                            var tr = $('<tr></tr>').appendTo($('#schedule-grid tbody'));
                            $('<td>Keine Stundenpläne vorhanden!</td>').appendTo(tr);

                            // Fügt fünf leere Felder hinzu (Ansonsten unregelmässige Spalte!)
                            for (var i = 0; i < 5; i++) {
                                $('<td></td>').appendTo(tr);
                            }
                            
                            FadeIn('#schedule-grid');
                        }
                }
            });
        } else {
            
            //Wenn keine Klasse ausgewählt ist
            FadeOut('#schedule-grid');
            $('#schedule-grid tbody').empty();
        }
    });
}

//Das mitgegebene Control wird eingefadet
function FadeIn(control) {
    $(control).fadeIn("slow");
}

//Das mitgegebene Control wird ausgefadet
function FadeOut(control) {
    $(control).fadeOut("slow");
}