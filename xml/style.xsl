<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <xsl:apply-templates select="requests" />
        <xsl:apply-templates select="cipher" />
    </xsl:template>
    <xsl:template match="cipher">
          <h4 style="padding: 8px 8px 2px 8px;">Your Encrypted Text: <small><xsl:value-of select="value" /></small></h4>
    </xsl:template>
    <xsl:template match="requests">
        <table class="table table-striped table-bordered">
            <thead>
                <h4>Your Latest Requests</h4>
                <hr />
                <tr>
                    <th>Input</th>
                    <th>Output</th>
                </tr>
            </thead>
            <xsl:for-each select="request">
                    <tr>
                        <td><xsl:value-of select="original" /></td>
                        <td><xsl:value-of select="encrypted" /></td>
                    </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
</xsl:stylesheet>
