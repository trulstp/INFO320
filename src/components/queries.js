// queries.js

const queries = [
  {
    label: "Most picked heroes",
    query: `PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>

      SELECT ?heroName ?timesPicked
      WHERE {
        {
          SELECT ?heroName (COUNT(?player) AS ?timesPicked)
          WHERE {
            ?player a :Player ;
                    :controlsHero ?hero .
      
            ?hero a :Hero ;
                  :localizedName ?heroName .
          }
          GROUP BY ?heroName
        }
      }
      ORDER BY DESC(?timesPicked)
      LIMIT 5`,
  },
  {
    label: "Most deadly heroes",
    query: `PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>

    SELECT ?heroName ?totalKills
    WHERE {
      {
        SELECT ?heroName (SUM(?kills) AS ?totalKills)
        WHERE {
          ?player a :Player ;
                  :controlsHero ?hero ;
                  :kills ?kills .
        
          ?hero a :Hero ;
                :localizedName ?heroName .
        }
        GROUP BY ?heroName
      }
    }
    ORDER BY DESC(?totalKills)
    LIMIT 5
    `,
  },
  {
    label: "Agility Heroes Abilities",
    query: `PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>

    SELECT ?heroName ?abilityName
    WHERE {
      ?hero a :Hero;
            :localizedName ?heroName.
      ?ability a :Ability;
                :abilityOf ?hero;
                :abilityName ?abilityName.
    }
    
    LIMIT 20`,
  },
  {
    label: "Purchases in a match",
    query: `
    PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>
    
    SELECT ?itemName ?purchaseTime
    WHERE {
      ?purchase a :Purchase ;
                :purchasedBy <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#Player/1/1> ;  # matchID 1 and playerSlot 1
                :purchasedItem ?item ;
                :gameTime ?purchaseTime .
      ?item :itemName ?itemName .
    }
    ORDER BY ?purchaseTime
    `,
  },
  {
    label: "Chat messages",
    query: `PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>

    SELECT ?chatMessage ?gameTime
    WHERE {
      ?chat a :Chat ;
             :isPartOfMatch <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#Match/1> ;  # matchID 1
             :sentByPlayer <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#Player/1/1> ;  # matchID 1 and playerSlot 1
             :chatMessage ?chatMessage ;
             :gameTime ?gameTime .
    }
    ORDER BY ?gameTime
    `,
  },
  {
    label: "Most purchased items in a match",
    query: `PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>

    SELECT ?itemName ?itemType (COUNT(?purchase) AS ?purchaseCount)
    WHERE {
      ?purchase a :Purchase ;
                :isPartOfMatch <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#Match/1> ;  # Replace 0 with the desired match ID
                :purchasedItem ?item .
      ?item :itemName ?itemName ;
    :itemType ?itemType .
    }
    GROUP BY ?itemName ?itemType
    ORDER BY DESC(?purchaseCount)
    LIMIT 20      
    `,
  },
  {
    label: "Upgrades in a match",
    query: `PREFIX : <http://www.semanticweb.org/trulsteigepettersen/ontologies/dota2DB#>

    SELECT ?playerID ?heroName ?abilityName ?level ?time
    WHERE {
      ?upgrade a :AbilityUpgrade ;
               :matchID 1 ;  # Specify the desired match ID
               :upgradedBy ?player ;
               :abilityID ?abilityID ;
               :level ?level ;
               :gameTime ?time .
      ?ability :abilityName ?abilityName ;
               :abilityID ?abilityID .
      ?player a :Player ; 
              :playerID ?playerID ;
              :matchID 1 ;
              :controlsHero ?hero .
      ?hero :localizedName ?heroName .
    }
    ORDER BY ?time     
    `,
  },
];

export default queries;
