import React from 'react';
import './App.css';

import { Col, Row, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

function About(){
    return (
        <Row>
            <Col xs={{span:22, offset: 1}} xl={{span: 18, offset: 3}} >
                <Typography>
                    <Paragraph>
                        This is an online database containing salary information for Purdue employees
                        for the fiscal years of 2011 through 2018. Anyone who got paid by Purdue and was
                        not a student is in this database, along with the amount compensated.
                    </Paragraph>
                    <Paragraph>
                        The data is
                        provided by Purdue University through their Public Records office. Salary information
                        at public universities is public information and is able to be requested through the university's
                        public records division. Student compensation is not listed in here due to FERPA restrictions.
                    </Paragraph>
                    <Paragraph>
                        If you're interested in looking at the code and source data, hit up the GitHub repo. Excel sheets
                        containing the salary data can be found in the <a href="https://github.com/fatcat2/sturdy-pancake">GitHub repo</a>. You can get the JSON for a specific year
                        by submitting a HTTP request to 
                        <Text code={true}>
                            https://salary.ryanjchen.com/data/"insert year".
                        </Text>
                        Example: 2018 data can be found at https://salary.ryanjchen.com/data/2018.
                    </Paragraph>
                    <Paragraph>
                        Requests for additional functionality can be
                        directed to ryanjchen2@gmail.com.
                    </Paragraph>
                </Typography>
            </Col>
         </Row>
    )
}

export default About;