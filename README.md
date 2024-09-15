# HTTP Authentication Using Schnorr Signatures

[![Status](https://img.shields.io/badge/status-draft-blue.svg)](https://nostrcg.github.io/http-schnorr-auth/)
[![W3C Community Group](https://img.shields.io/badge/W3C-Nostr%20Community%20Group-brightgreen.svg)](https://www.w3.org/community/nostr/)

Welcome to the repository for the **HTTP Authentication Using Schnorr Signatures** specification, developed by the [W3C Nostr Community Group](https://www.w3.org/community/nostr/). This specification defines a decentralized and secure method for authenticating HTTP requests using Schnorr signatures.

🔗 **Read the latest draft of the specification:** [https://nostrcg.github.io/http-schnorr-auth/](https://nostrcg.github.io/http-schnorr-auth/)

## Table of Contents

- [Introduction](#introduction)
- [Background](#background)
- [Use Cases](#use-cases)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Community](#community)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

As decentralized applications gain momentum, there's a growing need for secure, user-centric authentication mechanisms that don't rely on centralized authorities. This specification leverages Schnorr signatures—widely used in cryptocurrencies like Bitcoin and Litecoin—to provide a seamless, secure, and privacy-preserving authentication protocol suitable for modern web applications.

## Background

Schnorr signatures are renowned for their simplicity, efficiency, and provable security. Their adoption in blockchain technologies underscores their robustness and suitability for decentralized systems. By integrating Schnorr signatures into HTTP authentication, we aim to bridge the gap between traditional web services and decentralized authentication methods.

## Use Cases

- **Single Sign-On (SSO):** Authenticate across multiple services using a single cryptographic identity, eliminating passwords and enhancing user experience.
- **Decentralized Authentication:** Enable authentication in decentralized apps where traditional methods fall short, giving users control over their data.
- **Blockchain Integration:** Use existing cryptographic keys from blockchain networks to authenticate with web services securely.

## Getting Started

To implement or experiment with the specification:

1. **Read the Specification:** Familiarize yourself with the protocol details by reading the [latest draft](https://nostrcg.github.io/http-schnorr-auth/).

2. **Reference Implementations:**
   - **C# ASP.NET Authentication Handler:** [NostrAuth.cs](https://gist.github.com/v0l/74346ae530896115bfe2504c8cd018d3)
   - *(More implementations coming soon!)*

3. **Implement the Protocol:**
   - **Clients:** Construct and sign authentication events using your private Schnorr keys.
   - **Servers:** Validate incoming authentication events as per the specification guidelines.

## Contributing

We welcome contributions from the community! Here's how you can get involved:

1. **Report Issues:** Found a bug or have a feature request? [Open an issue](https://github.com/nostrcg/http-schnorr-auth/issues) to let us know.

2. **Submit Pull Requests:** If you'd like to contribute code or documentation improvements, please:
   - Fork the repository.
   - Create a new branch for your feature or fix.
   - Submit a pull request with a clear description of your changes.

3. **Join the Discussion:**
   - **Mailing List:** Subscribe to the [public-nostr mailing list](mailto:public-nostr@w3.org) for updates and discussions.
   - **GitHub Discussions:** Engage with other contributors on [GitHub Discussions](https://github.com/nostrcg/http-schnorr-auth/issues).

## Community

Stay connected with the W3C Nostr Community Group:

- **Website:** [https://www.w3.org/community/nostr/](https://www.w3.org/community/nostr/)
- **Meetings:** Regular meetings are held to discuss progress and collaborate on the specification. Details are available on the community group's website.
- **Contact:** For any inquiries, reach out to the group's chair, [Melvin Carvalho](https://melvincarvalho.com).

## License

This work is licensed under the terms of the [W3C Community Contributor License Agreement (CLA)](https://www.w3.org/community/about/agreements/cla/).

By contributing to this repository, you agree that your contributions are licensed under the CLA.

## Acknowledgments

We extend our gratitude to all the contributors and community members who have supported the development of this specification. Your expertise and dedication are invaluable.
