import React from "react";
import { Col, Row, Typography, Card } from "antd";
import { START_YEAR, CURRENT_YEAR } from "./constants";

const { Title, Paragraph, Text } = Typography;

const About: React.FC = () => {
  return (
    <Row>
      <Col xs={24} xl={{ span: 18, offset: 3 }}>
        <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Typography>
            <Title level={2} style={{ marginBottom: "24px" }}>
              About Purdue Salary Guide
            </Title>

            <Paragraph
              style={{
                fontSize: "16px",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              This is an online database containing salary information for
              Purdue employees for the fiscal years of {START_YEAR} through{" "}
              {CURRENT_YEAR}. Anyone who got paid by Purdue and was not a
              student is in this database, along with the amount compensated.
            </Paragraph>

            <Paragraph
              style={{
                fontSize: "16px",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              The data is provided by Purdue University through their Public
              Records office. Salary information at public universities is
              public information and is able to be requested through the
              university's public records division. Student compensation is not
              listed in here due to FERPA restrictions.
            </Paragraph>

            <Paragraph
              style={{
                fontSize: "16px",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              If you're interested in looking at the code and source data, hit
              up the GitHub repo. Excel sheets containing the salary data can be
              found in the{" "}
              <a
                href="https://github.com/fatcat2/sturdy-pancake"
                style={{ color: "#1890ff", textDecoration: "none" }}
              >
                GitHub repo
              </a>
              . You can get the JSON for a specific year by submitting a HTTP
              request to{" "}
              <Text code style={{ fontSize: "14px", padding: "4px 8px" }}>
                https://salary.ryanjchen.com/data/"insert year"
              </Text>
              . Example: {CURRENT_YEAR} data can be found at{" "}
              <a
                href={`https://salary.ryanjchen.com/data/${CURRENT_YEAR}`}
                style={{ color: "#1890ff", textDecoration: "none" }}
              >
                https://salary.ryanjchen.com/data/{CURRENT_YEAR}
              </a>
              .
            </Paragraph>

            <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
              Requests for additional functionality can be directed to{" "}
              <a
                href="mailto:ryanjchen2@gmail.com"
                style={{ color: "#1890ff", textDecoration: "none" }}
              >
                ryanjchen2@gmail.com
              </a>
              .
            </Paragraph>
          </Typography>
        </Card>
      </Col>
    </Row>
  );
};

export default About;
