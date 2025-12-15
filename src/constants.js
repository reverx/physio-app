export const jointMovements = {
    'Épaule': ['Flex', 'Ext', 'Abd', 'Add', 'Ri', 'Re'],
    'Coude': ['Flex', 'Ext', 'Pron', 'Sup'],
    'Poignet': ['Flex', 'Ext', 'Dr', 'Du'],
    'Hanche': ['Flex', 'Ext', 'Abd', 'Add', 'Ri', 'Re'],
    'Genou': ['Flex', 'Ext'],
    'Cheville': ['FD', 'FP', 'Inv', 'Ever'],
    'Main': [],
    'Tronc': [],
};

export const initialObjectiveData = { 'aa-bm': {} };
Object.keys(jointMovements).forEach(joint => {
    initialObjectiveData['aa-bm'][joint] = { 'Gauche': {}, 'Droite': {} };
    jointMovements[joint].forEach(movement => {
        const fields = { amplitudeActif: '', amplitudePassif: '', bilanMusculaire: '', douleur: '', sfm: '' };
        initialObjectiveData['aa-bm'][joint]['Gauche'][movement] = { ...fields };
        initialObjectiveData['aa-bm'][joint]['Droite'][movement] = { ...fields };
    });
});

export const bergItems = [
    'Passer de la position assis à debout',
    'Se tenir debout sans appui',
    'Se tenir assis sans appui',
    'Passer de la position debout à assis',
    'Transfert',
    'Se tenir debout les yeux clos',
    'Se tenir debout les pieds ensemble',
    'Déplacement antérieur bras étendus',
    'Ramasser un objet par terre',
    'Se retourner et regarder en arrière',
    'Tourner 360o',
    'alterner un pied sur un tabouret',
    'Se tenir debout pieds en tandem',
    'Se tenir debout sur une jambe',
];
export const exerciseCategories = {
    'Équilibre statique': [
        'Surface incliné 15 deg',
        'Surface instable',
        'Yeux fermés',
        'Pieds croisés',
        'Équilibre unipodal'
    ],
    'Équilibre dynamique': [
        'Fente différente directions',
        'Marche lat',
        'Marche lat pieds croisés',
        'Marche tandem',
        'Marche genoux haut',
        '1/2 fente avant',
        'Debout transfert de poids devant pieds'
    ],
    'Exs de renforcements M.infs': [
        'HEADER:Debout',
        'Squat',
        'HEADER:Assis',
        'Flex de hanche',
        'Ext du genou',
        'Flex du genou avec Terra-band'
    ],
    'Exs de renforcements M.Sups': [
        'Pushup debout incliné 45deg sur table',
        'Flex épaule avec Terra-band',
        'Abd épaule avec Terra-band',
        'Flex biceps avec Terra-band',
        'Ext triceps avec terra-band'
    ],
    'Exs de coordinations': [
        'Lancer balle et rattraper',
        'Dessiner l’Alphabet avec M.inf',
        'Dessiner l’Alphabet avec M.Sup',
        'Assis tache en 3 temps : taper (main G/genou G) suivi de (2 mains ensemble) suivi de (main D/genou droit) et recommencer.'
    ],
    'Autres': [
        'Marche',
        'Balayage visuel'
    ]
};
