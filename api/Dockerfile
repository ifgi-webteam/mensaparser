FROM dockerfile/nodejs

WORKDIR /usr/src/app
RUN npm install -g nodemon

# Alternative configuration:
#
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# COPY . /usr/src/app/
# RUN npm install
# RUN npm install -g nodemon

CMD ["sh", "delaystart.sh"]