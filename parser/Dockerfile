FROM dockerfile/nodejs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

RUN curl -L --insecure https://github.com/odise/go-cron/releases/download/v0.0.6/go-cron-linux.gz \
		| zcat > /usr/local/bin/go-cron \
	&& chmod u+x /usr/local/bin/go-cron

CMD ["sh", "delaystart.sh"]
