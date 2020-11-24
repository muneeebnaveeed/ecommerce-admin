import React, { Component } from 'react';

const currentYear = new Date().getFullYear();

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {currentYear} &copy; 4pace. All Rights Reserved. Crafted with{' '}
                            <i className="uil uil-heart text-danger font-size-12"></i> by
                            <a
                                href="https://github.com/muneeebnaveeed"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1">
                                Muneeb Naveed
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
