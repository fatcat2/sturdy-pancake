-- B10 movers
select Year2020.firstName,
    Year2019.lastName,
    Year2020.department,
    Year2020.compensation - Year2019.compensation as movement,
    (Year2020.compensation - Year2019.compensation)/Year2019.compensation as increase
from Year2020
    join Year2019 on Year2020.lastName = Year2019.lastName
    and Year2020.firstName = Year2019.firstName
    and Year2020.middleName = Year2019.middleName
order by movement asc
limit 10;
-- T10 movers
select Year2020.firstName,
    Year2019.lastName,
    Year2020.department,
    Year2019.compensation,
    Year2020.compensation,
    Year2020.compensation - Year2019.compensation as movement,
    (Year2020.compensation - Year2019.compensation)/Year2019.compensation as increase
from Year2020
    join Year2019 on Year2020.lastName = Year2019.lastName
    and Year2020.firstName = Year2019.firstName
    and Year2020.middleName = Year2019.middleName
order by movement desc
limit 10;
-- T10 department hiring
select count2020 - count2019 as movement,
    d2020
from (
        select count(Year2020.compensation) as count2020,
            Year2020.department as d2020
        from Year2020
        group by Year2020.department
    )
    join (
        select count(Year2019.compensation) as count2019,
            Year2019.department as d2019
        from Year2019
        group by Year2019.department
    ) on d2020 = d2019
order by movement desc
limit 10;
-- B10 department hiring
select count2020 - count2019 as movement,
    d2020
from (
        select count(Year2020.firstname) as count2020,
            Year2020.department as d2020
        from Year2020
        group by Year2020.department
    )
    join (
        select count(Year2019.firstname) as count2019,
            Year2019.department as d2019
        from Year2019
        group by Year2019.department
    ) on d2020 = d2019
order by movement asc
limit 10;


-- WBB moveres
select Year2020.firstName,
    Year2019.lastName,
    Year2020.department,
    Year2020.compensation - Year2019.compensation as movement,
    (Year2020.compensation - Year2019.compensation)/Year2019.compensation as increase
from Year2020
    join Year2019 on Year2020.lastName = Year2019.lastName
    and Year2020.firstName = Year2019.firstName
    and Year2020.middleName = Year2019.middleName
    and Year2020.department="WL - Men's Wrestling"
order by movement asc
limit 10;