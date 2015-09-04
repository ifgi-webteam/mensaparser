FROM node:0.10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN curl -L --insecure https://github.com/odise/go-cron/releases/download/v0.0.7/go-cron-linux.gz \
		| zcat > /usr/local/bin/go-cron \
	&& chmod u+x /usr/local/bin/go-cron

COPY package.json /usr/src/app/package.json
RUN npm install

COPY . /usr/src/app/

CMD ["sh", "delaystart.sh"]
