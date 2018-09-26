var app = {

  // Indique si on est en "hard" ou pas
  hardMode: false,

  // Indique si je peux retourner une carte ou pas
  // Ca me servira pour gérer le délais entre mes clics
  clickEnable: true,

  // Compteur qui m'indique combien de paires j'ai trouvé
  cardMatch: 0,

  // 2 petites propriétés qui me serviront à stocker
  // les 2 cartes qui vont être retournées
  card1: null,
  card2: null,

  // On lance notre application
  init: function() {

    // On écoute nos boutons de lancement
    // Quand on click sur l'un des deux bouton,
    // on lance une partie
    $('#normal, #hard').on('click', app.startGame);
  },

  // Lance une partie (en mode normal ou hard)
  startGame: function(evt) {

    // On masque les boutons
    $('.menu').hide();

    // Pour savoir si on est en "normal" ou "hard",
    // On se base sur l'ID du bouton sur lequel on
    // vient de cliquer par exemple
    if ($(evt.target).attr('id') == "hard") app.hardMode = true;

    // C'est parti, je génére toutes les cartes
    app.generateCards();

    // Pour la barre de progression, j'utilise la méthode
    // "animate" de jQuery qui va faire grandir la barre
    // automatiquement jusqu'à 100% avec le délais spécifié
    $('.progressBar').animate(
      { width: "100%" },
      (app.hardMode) ? 90 * 1000 : 60 * 1000,
      function() {

        // Quand le délais est arrivé à expiration,
        // je me contente d'afficher un message et
        // je raffraichis la page
        window.alert("Vous avez perduuuuuuuuuu !");
        window.location.reload();
      });
  },

  // Génère et affiche toutes les cartes
  generateCards: function() {

    /*
      Y'a pleins de solutions possible pour faire ça,
      celle que je vais utiliser, c'est de me créer un
      tableau JS qui va contenir les chiffres de 0 à 13
      (ou 17 si on est en hard). Chaque chiffre ca correspondre
      a une carte ! Je me servirais aussi de ces chiffres
      pour positionner la "backgroun-position" où il faut !
    */

    // Si on est en mode "normal", on a 14 paires de cartes
    // Comme ça ira de 0 à 13, y'aura bien 14 valeurs !
    var max = 13;
    // Si on est en mode "hard", on a 18 paires de cartes
    if (app.hardMode) max = 17;

    // Je génère mon tableau JS, qui va de 0 à 13 ou 17
    // Ca va me donner zeroToMax1 = [0, 1, 2, 3, 4, ..., 13];
    var zeroToMax1 = app.generateArray( max );


    // Comme il y a 2 cartes de chaque, je vais me refaire
    // un autre tableau avec les même valeurs !
    var zeroToMax2 = app.generateArray( max );

    // Maintenant que j'ai mes 2 tableaux de cartes,
    // je vais assembler ces 2 tableaux, j'aurais donc
    // un seul grand tableau avec les chiffres de 0 à max
    // et j'aurais tous les chiffres en double dedans !
    // Comme ça j'aurais un tableau qui va représenter
    // toutes mes paires de cartes !
    // Ca va me donner allCardsNumber = [0, 1, 2, ..., 13, 0, 1, 2, 3, ..., 13];
    var allCardsNumber = zeroToMax1.concat(zeroToMax2);

    // Maintenant je vais mélanger ce tableau !
    // On peut commenter cette ligne pour trouver
    // facilement les pairs une ligne sur 2 ;)
    // allCardsNumber = app.shuffle(allCardsNumber);

    // Je dispose maintenant de mon tableau de chiffres
    // et ce tableau est mélangé ! Je vais parcourir ce
    // tableau pour créer les "div" de mes cartes !
    for (var i = 0; i < allCardsNumber.length; i++) {

      // Dans cette boucle on va se servir du chiffre
      // que l'on a dans le tableau "allCardsNumber" qu'on
      // est en train de parcourir. Gardez bien à l'esprit
      // que ce chiffre est dans "allCardsNumber[ i ]"

      /*
        On crée la carte !
        Pour 1 carte, j'ai besoin de 3 "div" :
          <div  class="carte">
            <div class="cache">
            <div class="image">
          </div>
        Je crée donc ces 3 div
      */
      var carte = $('<div class="carte">');
      var cache = $('<div class="cache">');
      var image = $('<div class="image">');

      // Sur la div contenant l'image du fruit, je vais
      // positionner le background correctement. Je vais
      // me baser sur le chiffre de notre tableau "allCardsNumber"
      // pour positioner le background (chaque image fait 100px de haut)
      image.css('background-position', '0 -' + allCardsNumber[ i ] + '00px');
      // Ca me donnera background-position: '0 -000px'
      // Ca me donnera background-position: '0 -100px'
      // Ca me donnera background-position: '0 -200px'
      // ... etc

      // J'ajoute mes div "cache" et "image" dans la div parent
      carte.append(cache);
      carte.append(image);

      // Je vais tout de suite indiquer ce qu'il se passe
      // quand on ira cliquer sur cette carte là. Comme
      // ma variable "carte" est un objet jQuery (cf plus
      // haut), je peux directement utiliser la méthode
      // "on('click')" dessus
      carte.on('click', app.cardClick);

      // Maintenant que ma carte est bien construite et
      // que j'ai la bonne image d'affichée, je l'insère
      // dans le document
      $('#container').append(carte);
    }

    // Je gère juste un petit cas CSS pour que l'affichage
    // soit correct quand on est en "hard". J'aurais pu le
    // gérer avec des classes, mais je suis une feignasse !
    if (app.hardMode) $('#container').css('width', '990px');
  },

  // Génère un tableau contenant les chiffres de
  // 0 à max (13 ou 17 pour nous)
  generateArray: function(max) {

    // Je crée un tableau vide
    var tab = [];

    for (var nb = 0; nb <= max; nb++) {

      // J'ajoute le chiffre "nb" dans le tableau
      tab.push(nb);
    }

    return tab;
  },

  // Gère l'affichage quand on clique sur une carte
  cardClick: function(evt) {

    // Je regarde si je peux cliquer sur une carte ou pas
    // Ca permet de gérer le délais quand j'ai retourné
    // 2 cartes
    if (app.clickEnable) {

      // Est ce que la carte sur laquelle je viens de
      // cliquer a déjà été retournée ou pas ?
      // Si c'est sur la div "image" que j'ai cliqué,
      // alors oui, elle est déjà visible, donc on arrête là
      if ($(evt.target).hasClass('image')) return;

      // Je récupère la div parent pour mes traitements
      var carte = $(evt.target).parent();
      // Je récupère la div "image" de la carte
      var image = carte.children(".image");

      // On doit retourner la carte, je lance un petit
      // effet de rotation en ajoutant une classe sur
      // la carte et avec CSS, je gère la transition
      carte.addClass('flipped');
      // Je masque le carré gris
      carte.children(".cache").hide();
      // j'affiche l'image
      carte.children(".image").show();


      // Je regarde quelle carte je suis en train de retourner
      // Si je n'ai rien dans "app.card1", c'est que je suis en
      // train de retourner la première, sinon c'est la deuxième
      if (app.card1 == null) {

        // On retourne la première carte, je me contente
        // d'enregistrer la div "image" de la carte
        app.card1 = image;

      }
      else {

        // C'est la deuxième carte, du coup on va faire
        // les tests pour voir si les 2 cartes correspondent
        // Déjà, j'enregistre la deuxième carte
        app.card2 = image;

        // J'indique qu'on ne peux plus cliquer sur les cartes
        app.clickEnable = false;

        // Je regarde si les 2 cartes sont identiques. Pour ça,
        // plusieurs solutions... Celle que j'utilise c'est de
        // comparer la propriété "background-position" des 2 images
        if (app.card2.css('background-position') != app.card1.css('background-position')) {

          // Les deux cartes ne sont pas les mêmes, je vais
          // les masquer dans 1 seconde
          setTimeout(function() {
            // Je retourne la première carte face cachée
            app.card1.hide();
            app.card1.prev().show();
            app.card1.parent().removeClass('flipped');

            // Je retourne la deuxième carte face cachée
            app.card2.hide();
            app.card2.prev().show();
            app.card2.parent().removeClass('flipped');

            // J'indique seulement à ce moment qu'on peut
            // de nouveau cliquer sur les images
            app.clickEnable = true;

            // Je pense bien à supprimer ce que j'ai dans
            // mes variables, sinon ça va tout casser :p
            app.card1 = null;
            app.card2 = null;
          },
          // On fait bien tout ça dans 1 seconde
          1000);

        } else {

          // Les deux cartes sont les mêmes !
          // J'indique qu'on peut tout de suite retourner
          // une nouvelle carte
          app.clickEnable = true;

          // Je pense bien à supprimer ce que j'ai dans
          // mes variables, sinon ça va tout casser :p
          app.card1 = null;
          app.card2 = null;

          // J'indique qu'on a trouvé une paire de plus !
          app.cardMatch += 1;

          // La dernière chose qu'il me reste à faire,
          // c'est de regarder si on a gagné ou pas !
          app.isWin();

          // Si on test, on voit que ça n'affiche pas
          // la dernière carte, on peut laisser un petit
          // moment au navigateur pour qu'il fasse la
          // transition.
          // setTimeout(app.isWin, 1000);
        }
      }
    }
  },

  isWin: function() {

    if (!app.hardMode && app.cardMatch == 14) {

      // Mode "normal" + 14 paires de trouvées !
      window.alert("Vous avez gagnéééééééééé !");
      window.location.reload();
    }
    else if (app.hardMode && app.cardMatch == 18) {

      // Mode "hard" + 18 paires de trouvées !
      window.alert("Vous avez gagnéééééééééé !");
      window.location.reload();
    }
  },

  // On a récupérer une fonction de mélange, parce qu'on
  // ne veux pas ré-inventer la roue et que c'est pas facile !
  // Là ce que ça fait, c'est des permutations entre les
  // différentes valeurs du tableau
  // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  shuffle: function(list) {

    for (let i = list.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    return list;
  }
}

// On démarre notre application
$(app.init);
