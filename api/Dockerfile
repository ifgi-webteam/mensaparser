FROM dockerfile/nodejs

# Alternative configuration:
#
# WORKDIR /usr/src/app
# RUN npm install -g nodemon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install

CMD ["sh", "delaystart.sh"]