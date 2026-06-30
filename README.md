# sistemacamp

Статический лендинг для привлечения участников в Sistema Weekends: Профи-выходные.

## Публичный адрес

https://bul82info.ru/sistemacamp/

## Локальный просмотр

```sh
python3 -m http.server 8080
```

После запуска страница доступна на `http://127.0.0.1:8080/`.

## Деплой

```sh
python3 deploy_sistemacamp.py
```

На сервере проект развернут в структуре:

`/var/www/landings/sistemacamp/releases/<timestamp>`

Актуальная версия переключается ссылкой:

`/var/www/landings/sistemacamp/current`
