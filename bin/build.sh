#!/usr/bin/env sh
# Copyright (C) 2021-2024 Solution Libre
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

cd "$(dirname "$0")/.." || exit 1

compile_font() {
  font_name=$1
  font_styles=$2
  css_filename="public/css/font/${font_name}.css"

  css_files=''
  for font_style in ${font_styles}; do
    css_files="${css_files} ${font_style}.css"
    filename="${font_name}-all-${font_style}"
    echo "${font_style}" | grep - > /dev/null || filename="${filename}-normal"
    filename="${filename}.woff"
    cp "node_modules/@fontsource/${font_name}/files/${filename}" public/css/font/files
  done
  {
    cd "node_modules/@fontsource/${font_name}/" || exit
    # shellcheck disable=SC2086
    cat ${css_files}
    cd - > /dev/null || exit
  } > "${css_filename}"

  grep url "${css_filename}" | awk -F "'" '{print $2}' | while IFS= read -r fontFile; do
    cp "node_modules/@fontsource/${font_name}/${fontFile}" public/css/font/files
  done
}

if [ ! -d './vendor' ] || [ ! -d './node_modules' ]; then
  ./bin/install.sh
fi

./bin/clean.sh

cp -r src public
gzip -c public/sitemap.xml > public/sitemap.xml.gz
cp -pr ./node_modules/startbootstrap-freelancer/dist public/startbootstrap-freelancer
cp ./node_modules/validate.js/validate.min.js ./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js public/js/
cp ./node_modules/@fortawesome/fontawesome-free/js/all.min.js public/js/fontawesome-all.min.js

mkdir -p public/css/font/files

compile_font 'montserrat' '100 400 600'

compile_font 'lato' '300 400 700 300-italic 400-italic 700-italic'

