# Table of contents for Design Documentation<!-- omit in toc -->


- [Project Overview](/Documents/ProjectOverview.md)
- [UseCase](/Documents/User%20Stories%20and%20Use%20Cases/UseCase.md)
- [Activity](/Documents/User%20Stories%20and%20Use%20Cases/Activity.md)
- [UseCase Description](/Documents/User%20Stories%20and%20Use%20Cases/UseCaseDescription.md)
- [Site Map](#site-map)
- [Table Definition Document](/Documents/Database%20Design/TableDefinitionDocument.md)
- [Entity-Relationship Diagrams](/Documents/Database%20Design/Entity-RelationshipDiagrams.md)

# Introduction<!-- omit in toc -->


## Setting of timezone
Set time zone with this process

```php
// config/app.php

'timezone' => 'Asia/Tokyo',

```

## Setting of Confirm files for login function
### .env

```php
# 修正前
SANCTUM_STATEFUL_DOMAINS=localhost

# 修正後
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
SESSION_DOMAIN=localhost  # 追加

```

