#!/bin/bash

FILE="src/components/layout/Header.tsx"

# 1. Supprimer FaWifiOff de l'import
sed -i "/FaWifiOff,/d" $FILE

# 2. Remplacer FaWifiOff par FaWifi avec classe différente
sed -i 's/<FaWifiOff className="mr-2 text-orange-300"/<FaWifi className="mr-2 text-gray-400 opacity-75"/g' $FILE

# 3. Mettre à jour les titres (tooltips)
sed -i 's/"Tsy misy Internet - ampiasaina ihany"/"Hors ligne - Fonctionne localement"/g' $FILE

# 4. Ajouter des assertions de type (optionnel mais recommandé)
# Créer une copie de sauvegarde d'abord
cp $FILE "${FILE}.backup"

echo "FaWifiOff a été remplacé par FaWifi"
echo "L'état offline sera indiqué par une icône grise et semi-transparente"
