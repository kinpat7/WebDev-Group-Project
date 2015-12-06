<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cc="https://cipher-natedrake13.c9users.io/ns/tns">
    <xsl:template match="/">
        <xsl:apply-templates select="requests" />
        <xsl:apply-templates select="cipher" />
        <xsl:apply-templates select="cc:requests" />
    </xsl:template>
    
    <xsl:template match="cipher">
          <h4 style="padding: 8px 8px 2px 8px;">Your Encrypted Text: <small><xsl:value-of select="value" /></small></h4>
    </xsl:template>
    
    <xsl:template match="requests">
        <table class="table table-striped table-bordered">
            <h2>Your Latest Encoded Messages</h2>
            <thead>
                <hr />
                <tr>
                    <th>Encoded Message</th>
                </tr>
            </thead>
            <xsl:for-each select="request">
                    <tr>
                        <td class="request-entry" title="double click to delete">
                            <span class="hidden" id="request-id"><xsl:value-of select="id"/></span>
                            <xsl:value-of select="encrypted" />
                        </td>
                    </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
    
    <xsl:template match="cc:requests">
        <html>
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
                <link rel="stylesheet" href="../res/css/style.css"/>
                <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
            </head>
            <body>
                <div class="row">
                    <div class="col-sm-2 col-xs-1"></div>
                    <div class="col-sm-8 col-xs-10">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered ">
                                <thead>
                                    <h4>Archive of requests</h4>
                                    <hr />
                                    <tr>
                                        <th>Encoded Text</th>
                                        <th>DateTime</th>
                                    </tr>
                                </thead>
                                <xsl:for-each select="cc:request">
                                    <tr>
                                        <td><xsl:value-of select="cc:encrypted" /></td>
                                        <td><xsl:value-of select="cc:requested" /></td>
                                    </tr>
                                </xsl:for-each>
                            </table>
                        </div>
                    </div>
                    <div class="col-sm-2 col-xs-1"></div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
